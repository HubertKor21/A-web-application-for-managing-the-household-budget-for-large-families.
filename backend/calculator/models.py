# models.py
from django.db import models
from accounts.models import CustomUserModel
from django.core.exceptions import ValidationError

class SavingsCalculator(models.Model):
    user = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE, 
                             related_name='savings_calculators')
    expense_category = models.CharField(max_length=50)  
    monthly_spending = models.FloatField()  
    user_savings_percent = models.FloatField(default=20.0)  
    suggested_savings = models.FloatField(null=True, blank=True)  
    potential_savings = models.FloatField(null=True, blank=True) 
    created_at = models.DateTimeField(auto_now_add=True)

    def calculate_savings(self):
        """Oblicza, ile można zaoszczędzić na podstawie wydatków i procentu wybranego przez użytkownika"""
        self.suggested_savings = self.monthly_spending * (self.user_savings_percent / 100)
        self.potential_savings = self.suggested_savings * 12  # Potencjalne oszczędności roczne
        self.save()

    def clean(self):
        if self.monthly_spending < 0:
            raise ValidationError("Miesięczne wydatki nie mogą być ujemne")
        if not (0 <= self.user_savings_percent <= 100):
            raise ValidationError("Procent oszczędności musi być w zakresie 0-100")

    def __str__(self):
        return f'Savings Calculator for {self.user.email}: {self.potential_savings} PLN/year'
