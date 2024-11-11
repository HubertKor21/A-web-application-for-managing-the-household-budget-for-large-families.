from django.apps import apps
from django.db import models
import uuid

class Family(models.Model):
    name = models.CharField(max_length=150)

    # We define the ForeignKey field without assigning the model at the class level
    def get_user_model(self):
        CustomUserModel = apps.get_model('accounts', 'CustomUserModel')
        return CustomUserModel

    def __str__(self):
        return self.name

    # Use `get_user_model` within methods, where models are already loaded
    def add_member(self, user):
        CustomUserModel = self.get_user_model()
        self.members.add(user)

    # Define the members and created_by fields dynamically in methods to avoid circular imports
    @property
    def members(self):
        CustomUserModel = self.get_user_model()
        return models.ManyToManyField(CustomUserModel, related_name='families')

    @property
    def created_by(self):
        CustomUserModel = self.get_user_model()
        return models.ForeignKey(CustomUserModel, on_delete=models.CASCADE, related_name='created_families')
    
    @property
    def member_count(self):
        return self.members.count()

class Invite(models.Model):
    email = models.EmailField()
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_accepted = models.BooleanField(default=False)

    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='invites')

    def get_user_model(self):
        CustomUserModel = apps.get_model('accounts', 'CustomUserModel')
        return CustomUserModel

    @property
    def invited_by(self):
        CustomUserModel = self.get_user_model()
        return models.ForeignKey(CustomUserModel, on_delete=models.CASCADE, related_name='sent_invites')

    def __str__(self):
        return f'Invite to {self.family.name} for {self.email}'
