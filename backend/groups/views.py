from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from .serializers import GroupsSerializers, CategorySerializer, GroupBalanceSerializer
from .models import Groups, Category
from invitations.models import Family
from rest_framework.views import APIView
from django.db.models import Sum, Q
from django.shortcuts import get_object_or_404
from transactions.models import Bank
from .models import Category

from groups import models



# Create your views here.
class GroupsCreateView(generics.ListCreateAPIView):
    serializer_class = GroupsSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            family = Family.objects.get(members=user)
            return Groups.objects.filter(family=family).prefetch_related('categories', 'family')
        except Family.DoesNotExist:
            return Groups.objects.none()

    def perform_create(self, serializer):
        family = Family.objects.get(members=self.request.user)
        serializer.save(groups_author=self.request.user, family=family)


class AddCategoryToGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def get_group(self, pk):
        return get_object_or_404(Groups, id=pk, groups_author=self.request.user)

    def post(self, request, pk):
        # Dodawanie kategorii
        group = self.get_group(pk)
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            bank_id = request.data.get('bank')
            bank = Bank.objects.filter(id=bank_id).first() if bank_id else None
            category = serializer.save(category_author=self.request.user, bank=bank)
            group.categories.add(category)  # Add the new category to the group
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, id):
        # Pełna aktualizacja kategorii
        group = self.get_group(pk)
        category = get_object_or_404(Category, id=id, group=group)
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            bank_id = request.data.get('bank')
            bank = Bank.objects.filter(id=bank_id).first() if bank_id else None
            serializer.save(category_author=self.request.user, bank=bank)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, id):
        # Częściowa aktualizacja kategorii
        group = self.get_group(pk)
        category = get_object_or_404(Category, id=id, group=group)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            bank_id = request.data.get('bank')
            bank = Bank.objects.filter(id=bank_id).first() if bank_id else None
            serializer.save(category_author=self.request.user, bank=bank)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GroupBalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        # Możemy dodać filtry, np. tylko dla grup należących do zalogowanego użytkownika
        if pk:

            try:
                group = Groups.objects.get(id=pk, groups_author=request.user)
                serializer = GroupBalanceSerializer(group)
                return Response(serializer.data)
            except Groups.DoesNotExist:
                return Response({'detail': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Jeśli nie podano `pk`, możemy zwrócić bilans dla wszystkich grup
            groups = Groups.objects.all()
            serializer = GroupBalanceSerializer(groups, many=True)
            return Response(serializer.data)