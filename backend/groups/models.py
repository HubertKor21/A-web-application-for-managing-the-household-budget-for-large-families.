from django.db import models
from accounts.models import CustomUserModel
from invitations.models import Family



# Create your models here.

class Category(models.Model):
    category_title = models.CharField(max_length=50)
    category_note = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    assigned_amount = models.FloatField(max_length=200, default=0)
    category_author = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE, null=True, blank=True)

class Groups(models.Model):
    groups_title = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    groups_author = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE, related_name='authored_groups')
    categories = models.ManyToManyField(Category, related_name='groups')  # Zmiana z ForeignKey na ManyToManyField
    family = models.ForeignKey(Family, on_delete=models.CASCADE, null=True,blank=True)