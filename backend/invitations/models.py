from django.db import models
from accounts.models import CustomUserModel  
import uuid

# Create your models here.
class Family(models.Model):
    name = models.CharField(max_length=150)
    members = models.ManyToManyField(CustomUserModel, related_name='families')
    created_by = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE, related_name='created_families')

    def __str__(self):
        return self.name
    
class Invite(models.Model):
    email = models.EmailField()
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    invited_by = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE, related_name='sent_invites')
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='invites')
    created_at = models.DateTimeField(auto_now_add=True)
    is_accepted = models.BooleanField(default=False)

    def __str__(self):
        return f'Invite to {self.family.name} for {self.email}'