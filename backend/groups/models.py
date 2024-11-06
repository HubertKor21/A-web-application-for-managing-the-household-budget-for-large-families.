from django.db import models
from django.db.models import Sum
from accounts.models import CustomUserModel
from invitations.models import Family




# Create your models here.

class Category(models.Model):
    CATEGORY_TYPE_CHOICES = [
        ('expense', 'Wydatki'),
        ('income', 'Przychody'),
    ]

    category_title = models.CharField(max_length=50)
    category_note = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    assigned_amount = models.FloatField(max_length=200, default=0)
    category_type = models.CharField(max_length=7, choices=CATEGORY_TYPE_CHOICES, default='expense')
    category_author = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE, null=True, blank=True)

class Groups(models.Model):
    groups_title = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    groups_author = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE, related_name='authored_groups')
    categories = models.ManyToManyField(Category, related_name='groups')  # Zmiana z ForeignKey na ManyToManyField
    family = models.ForeignKey(Family, on_delete=models.CASCADE, null=True,blank=True)

    def get_total_expenses(self):
        """Zlicza sumę wydatków (assigned_amount) w grupie"""
        return self.categories.filter(category_type='expense').aggregate(total_expenses=Sum('assigned_amount'))['total_expenses'] or 0

    def get_total_income(self):
        """Zlicza sumę przychodów (assigned_amount) w grupie"""
        return self.categories.filter(category_type='income').aggregate(total_income=Sum('assigned_amount'))['total_income'] or 0

    def get_balance(self):
        """Zlicza różnicę między przychodami a wydatkami"""
        total_expenses = self.get_total_expenses()
        total_income = self.get_total_income()
        return total_income - total_expenses