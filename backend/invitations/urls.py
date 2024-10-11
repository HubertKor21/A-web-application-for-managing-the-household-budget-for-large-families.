from django.urls import path

from .views import ConfirmInvitationView, InviteUserView, FamilyMembersView


urlpatterns = [
    path('v1/invite/', InviteUserView.as_view(), name='invite-user'),
    path('v1/confirm-invite/<str:token>/', ConfirmInvitationView.as_view(), name='confirm-invite'),
    path('families/<int:family_id>/members/', FamilyMembersView.as_view(), name='family_members'),
]