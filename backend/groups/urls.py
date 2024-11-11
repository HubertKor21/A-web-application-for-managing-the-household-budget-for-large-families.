from django.urls import include, path
from . import views
from .views import AddCategoryToGroupView

urlpatterns = [
    path('groups/', views.GroupsCreateView.as_view(), name='groups-list'),
    path('groups/<int:pk>/add-categories/', AddCategoryToGroupView.as_view(), name='category-list'),
    path('groups/<int:pk>/update-categories/<int:id>/', AddCategoryToGroupView.as_view(), name='update-category'),
    path('group-balance/', views.GroupBalanceView.as_view(), name='group-balance-list'),
    path('group-balance/<int:pk>/', views.GroupBalanceView.as_view(), name='group-balance-detail'),


]