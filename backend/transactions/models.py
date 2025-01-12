from django.db import models
from accounts.models import CustomUserModel
from invitations.models import Family
from django.utils.timezone import now

class Bank(models.Model):
    user = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE, 
                             related_name='banks')
    bank_name = models.CharField(max_length=50, blank=True, null=True)
    balance = models.FloatField(default=0)
    family = models.ForeignKey(Family, on_delete=models.CASCADE,
                               related_name='banks_family', null=True, blank=True)

    def __str__(self):
        return f'{self.user.email} Bank Account - Balance: {self.balance}'

    def save(self, *args, **kwargs):
        is_new = self.pk is None  # Check if this is a new bank account

        # Save the Bank instance
        super().save(*args, **kwargs)

        # If the bank account is new, create the initial transaction
        if is_new:
            Transaction.objects.create(bank=self, amount=self.balance, date=now().strftime("%Y-%m-%d"))
        else:
            # Update or create a new transaction with the new balance
            last_transaction = self.transactions.last()  # Get the latest transaction for this bank account
            if last_transaction:
                # Update the last transaction amount to match the current balance
                last_transaction.amount = self.balance
                last_transaction.save()
            else:
                # If no previous transaction exists, create a new one
                Transaction.objects.create(bank=self, amount=self.balance, date=now().strftime("%Y-%m-%d"))

        # Update the family budget based on the new balance
        family = self.user.family
        if family:
            total_balance = sum(bank.balance for bank in Bank.objects.filter(user__family=family))
            family_budget, created = Budget.objects.get_or_create(family_id=family)
            family_budget.amount = total_balance
            family_budget.save()

class Budget(models.Model):
    family_id = models.ForeignKey(Family, on_delete=models.CASCADE,
    related_name='budgets')
    amount = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Budget for {self.family_id} - {self.amount}'  # Use `self.family_id` here

    def save(self, *args, **kwargs):
        # No changes needed here if there are no references to `family`
        super().save(*args, **kwargs)

class Transaction(models.Model):
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE,
                              related_name='transactions')
    amount = models.FloatField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'{self.bank.bank_name} - {self.amount} on {self.date}'