import uuid
from django.shortcuts import redirect
from rest_framework import views
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from .serializers import ConfirmInvitationSerializer, InviteUserSerializer, CustomUserSerializer, FamilySerializer
from accounts.models import CustomUserModel
from .models import Family, Invite
from rest_framework.permissions import IsAuthenticated
from django.db import transaction


class InviteUserView(views.APIView):
    serializer_class = InviteUserSerializer

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

            # Check if the user is already a member of a family
            if user.families.filter(name=family_name).exists():
                return "User is already a member of this family."

            current_family = user.families.first()
            if current_family:
                # Notify the user about the possibility of joining the new family
                token = uuid.uuid4().hex
                invite_url = f"{settings.FRONTEND_URL}api/v1/confirm-invite/{token}/"
                
                send_mail(
                    'Invitation to a new family',
                    f'You are currently in the family "{current_family.name}". '
                    f'Would you like to leave and join the family "{family_name}"? '
                    f'Click the link to accept: {invite_url}',
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                )

                # Store the invite token and target family in the database for later confirmation
                Invite.objects.create(
                    email=email,
                    token=token,
                    family=Family.objects.get_or_create(name=family_name)[0],
                )
                return "Invitation to join a new family sent. Waiting for user confirmation."
            


            # If the user is not part of a family, add them to the new family
            family, created = Family.objects.get_or_create(
                name=family_name,
                defaults={'created_by': user}
            )

            with transaction.atomic():
                user.families.add(family)
                token = uuid.uuid4().hex
                invite_url = f"{settings.FRONTEND_URL}api/v1/confirm-invite/{token}/"
                send_mail(
                    'You have been invited!',
                    f'You have been invited to join the family "{family_name}". Click the link to accept: {invite_url}',
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                )

            return "Invitation sent!"

        except CustomUserModel.DoesNotExist:
            return "User not found."


class ConfirmInvitationView(views.APIView):
    
    def post(self, request, token):
        """
        Confirm the invitation and move the user to the new family.
        """
        try:
            # Retrieve the invitation by token
            invite = Invite.objects.filter(token=token, is_accepted=False).first()
            if not invite:
                return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)
            
            user = request.user

            # Ensure the user matches the email in the invitation
            if user.email != invite.email:
                return Response({'detail': 'You are not authorized to confirm this invitation.'}, status=status.HTTP_403_FORBIDDEN)

            # Start transaction to ensure data consistency
            with transaction.atomic():
                # If the user belongs to a different family, remove them from that family
                if user.family and user.family != invite.family:
                    user.family.members.remove(user)  # Remove user from old family

                # Assign the new family to the user
                invite.family.members.add(user)  # Add user to new family
                user.family = invite.family  # Update user's family field
                user.save()

                # Mark the invitation as accepted
                invite.is_accepted = True
                invite.save()

            return Response({'detail': 'Invitation confirmed successfully!'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'detail': f'An error occurred: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


        
class FamilyMembersView(views.APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CustomUserSerializer
    
    def get(self , request):
        try:
            family = request.user.family

            if not family:
                return Response({'detail': 'No family associated with this user'}, status=status.HTTP_404_NOT_FOUND)
            
            members = family.members.all()
            serializer = CustomUserSerializer(members, many=True)
            
            return Response({
                'id': family.id,
                'member_count': family.member_count,
                'members': serializer.data 
            }, status=status.HTTP_200_OK)
        except  Family.DoesNotExist:
            return Response({'detail': 'Family not found'}, status=status.HTTP_404_NOT_FOUND)
        
class CreateFamilyView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get the current logged-in user
        user = request.user
        
        # Ensure the user doesn't already have a family (optional, depending on your logic)
        if hasattr(user, 'family') and user.family is not None:
            return Response({'detail': 'You already belong to a family.'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the family name from the request data
        family_name = request.data.get('name')

        if not family_name:
            return Response({'detail': 'Family name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new Family and assign the user as the 'created_by' (creator)
        family = Family.objects.create(name=family_name, created_by=user)

        # Add the creator (user) as the first member of the family
        family.members.add(user)

        # Update the user's 'family' field to reference the newly created family
        user.family = family
        user.save()

        # Serialize the family information
        serializer = FamilySerializer(family)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class FamilyNameView(views.APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CustomUserSerializer
    
    def get(self , request):
        try:
            family = request.user.family

            if not family:
                return Response({'detail': 'No family associated with this user'}, status=status.HTTP_404_NOT_FOUND)
            
            members = family.members.all()
            serializer = CustomUserSerializer(members, many=True)
            
            return Response({
                "name": family.name,
            }, status=status.HTTP_200_OK)
        except  Family.DoesNotExist:
            return Response({'detail': 'Family not found'}, status=status.HTTP_404_NOT_FOUND)