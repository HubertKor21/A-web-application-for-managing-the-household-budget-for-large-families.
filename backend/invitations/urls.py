from django.urls import path

from .views import ConfirmInvitationView, InviteUserView, FamilyMembersView, CreateFamilyView, FamilyNameView


urlpatterns = [
    path('v1/invite/', InviteUserView.as_view(), name='invite-user'),
    path('v1/confirm-invite/<str:token>/', ConfirmInvitationView.as_view(), name='confirm-invite'),
    path('families/members/', FamilyMembersView.as_view(), name='members'),
    path('create-family/', CreateFamilyView.as_view(), name='create-family'),
    path('families/name/', FamilyNameView.as_view(), name="family-name"),
]