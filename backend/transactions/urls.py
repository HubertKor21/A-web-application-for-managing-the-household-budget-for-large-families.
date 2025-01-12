from django.urls import path
from .views import BankListCreateView, BudgetDetailView, CurrentMonthBalanceView, BankNameListView, IncomeByDateView, AllPreviousMonthBalanceView, PreviousMonthBalanceView

urlpatterns = [
    path('banks/', BankListCreateView.as_view(), name='bank-list-create'),
    path('banks/<int:bank_id>/', BankListCreateView.as_view(), name='bank-update'),
    path('banks/name/', BankNameListView.as_view(), name='bank-list'),
    path('budget/', BudgetDetailView.as_view(), name='budget-detail'),
    path('balance/monthly/', CurrentMonthBalanceView.as_view(), name='monthly-balance'),
    path('income-by-date/', IncomeByDateView.as_view(), name='income-by-date'),
    path('balance/all-mounths/', AllPreviousMonthBalanceView.as_view(), name='all-mounths'),
    path('balance/previous-balance/', PreviousMonthBalanceView.as_view(), name='current-month-balance'),

]