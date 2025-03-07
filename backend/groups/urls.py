from django.urls import path
from . import views


urlpatterns = [
    path('groups/', views.GroupsCreateView.as_view(), name='groups-list'),
    path('groups/<int:pk>/', views.DeleteGroupView.as_view(), name='delete-group'),
    path('groups/<int:pk>/add-categories/', views.AddCategoryToGroupView.as_view(), name='category-list'),
    path('group-balance/', views.GroupBalanceView.as_view(), name='group-balance-create'),
    path('group-balance/<int:pk>/', views.GroupBalanceView.as_view(), name='group-balance-retrieve'),
    path('group-balance-chart/<int:pk>/', views.GroupBalanceForChartView.as_view(), name='group-balance-chart-retrieve'),
    path('group-balance-chart/', views.GroupBalanceForChartView.as_view(), name='group-balance-chart-all'),
    path('groups/<int:group_id>/categories/<int:category_id>/', views.GroupCategoryDetailView.as_view(), name='group-category-detail'),
]