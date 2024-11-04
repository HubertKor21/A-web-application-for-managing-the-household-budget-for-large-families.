from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import GroupsSerializers, CategorySerializer
from .models import Groups, Category
from invitations.models import Family
from django.shortcuts import get_object_or_404

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

class AddCategoryToGroupView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        group_id = self.kwargs.get('pk')
        group = get_object_or_404(Groups, id=group_id, groups_author=self.request.user)
        return group.categories.all()

    def perform_create(self, serializer):
        group_id = self.kwargs.get('pk')
        group = get_object_or_404(Groups, id=group_id, groups_author=self.request.user)

        # Save the category and associate it with the group
        category = serializer.save(category_author=self.request.user)
        group.categories.add(category)  # Add the new category to the group

        return category
