from django.urls import include, path
from . import views

urlpatterns = [
    path('groups/', views.GroupsCreateView.as_view(), name='groups-list'),
    path('groups/<int:pk>/add-categories/', views.AddCategoryToGroupView.as_view(), name='category-list'),
    path('financial_summary/', views.FinancialSummaryView.as_view(), name='financial_summary'),

]