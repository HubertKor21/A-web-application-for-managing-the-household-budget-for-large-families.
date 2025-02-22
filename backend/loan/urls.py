from django.urls import path
from . import views

urlpatterns = [
    path('loans/', views.LoanListCreateView.as_view(), name='loan-list-create'),
    path('loans/<int:loan_id>/', views.LoanListCreateView.as_view(), name='loan-detail'),
    path('loan/<int:loan_id>/installments/', views.LoanInstallmentsDetailView.as_view(), name='loan_installments'),
    path('calculate-rate/', views.CalculateRateView.as_view(), name='calculate-rate'),

]
