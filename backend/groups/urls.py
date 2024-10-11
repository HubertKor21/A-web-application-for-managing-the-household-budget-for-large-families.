from django.urls import include, path
from . import views

urlpatterns = [
    path('groups/', views.GroupsCreateView.as_view(), name='groups-list'),
    path('groups/category/', views.CategoryView.as_view(), name='category-list'),
]