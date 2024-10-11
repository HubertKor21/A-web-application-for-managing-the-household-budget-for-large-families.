from django.db import models
from accounts.models import CustomUserModel



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
    category = models.ForeignKey(Category, related_name='groups', on_delete=models.CASCADE  ,null=True, blank=True)
