from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import GroupsSerializers, CategorySerializer
from .models import Groups, Category

# Create your views here.
class GroupsCreateView(generics.ListCreateAPIView):
    serializer_class = GroupsSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Groups.objects.filter(groups_author = user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(groups_author = self.request.user)
        else:
            print(serializer.errors)

class CategoryView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # user = self.request.user
        return Category.objects.all()
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)