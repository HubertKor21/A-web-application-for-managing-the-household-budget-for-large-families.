import uuid
from rest_framework import views
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from .serializers import ConfirmInvitationSerializer, InviteUserSerializer, CustomUserSerializer
from accounts.models import CustomUserModel
from .models import Family
from rest_framework.permissions import IsAuthenticated

class InviteUserView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = InviteUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        family_name = serializer.validated_data['family_name']

        result = self.invite_user(email,family_name)

        if result == "Invitation sent!":
            return Response({'detail': result}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': result}, status=status.HTTP_404_NOT_FOUND)

    def invite_user(self, email, family_name):
        try:
            user = CustomUserModel.objects.get(email=email)

            # Dodaj użytkownika do rodziny
            family, created = Family.objects.get_or_create(name=family_name, defaults={'created_by': user})
            
            if user in family.members.all():
                return "User is already in family"
            
            family.members.add(user)
            family.save()

            # Generowanie UUID jako token
            token = uuid.uuid4().hex  # Generuje unikalny token w formacie hex

            # Tworzenie pełnego URL do zaproszenia
            invite_url = f"{settings.FRONTEND_URL}api/v1/confirm-invite/{token}/"  # Upewnij się, że masz prawidłowy URL

            # Wysyłanie e-maila z zaproszeniem
            send_mail(
                'You have been invited!',
                f'You have been invited to join the family {family_name}. Click the link to accept: {invite_url}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            return "Invitation sent!"
        except CustomUserModel.DoesNotExist:
            return "User not found."

        
class ConfirmInvitationView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, token):
        serializer = ConfirmInvitationSerializer(data={'token':token})
        serializer.is_valid(raise_exception=True)

        try:
            return Response({"detail": "Invitation confirmed!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class FamilyMembersView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self , request, family_id):
        try:
            family = Family.objects.get(id=family_id)
            members = family.members.all()

            serializer = CustomUserSerializer(members, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except  Family.DoesNotExist:
            return Response({'detail': 'Family not found'}, status=status.HTTP_404_NOT_FOUND)