from django.urls import path
from .views import BankListCreateView, BudgetDetailView

urlpatterns = [
    path('banks/', BankListCreateView.as_view(), name='bank-list-create'),
    path('budget/', BudgetDetailView.as_view(), name='budget-detail'),
]
