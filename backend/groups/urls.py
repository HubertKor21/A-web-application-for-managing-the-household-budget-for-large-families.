from django.urls import include, path
from . import views
from .views import AddCategoryToGroupView

urlpatterns = [
    path('groups/', views.GroupsCreateView.as_view(), name='groups-list'),
    path('groups/<int:pk>/add-categories/', AddCategoryToGroupView.as_view(), name='category-list'),
    path('groups/<int:pk>/update-categories/<int:id>/', AddCategoryToGroupView.as_view(), name='update-category'),
    path('group-balance/', views.GroupBalanceView.as_view(), name='group-balance-list'),
    path('group-balance/<int:pk>/', views.GroupBalanceView.as_view(), name='group-balance-detail'),
    path('groups/add-categories/', AddCategoryToGroupView.as_view(), name='add-categories'),
    path('group-balance-chart/<int:pk>/', views.GroupBalanceForChartView.as_view(), name='group-balance-chart'),
    path('balance/current-month/', views.PreviousMonthBalanceView.as_view(), name='current-month-balance'),
    path('group-balance-chart/', views.GroupBalanceForChartView.as_view(), name='group-balance-chart'),

]