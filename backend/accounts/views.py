from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
def email_confirmation(uid,token):
    return JsonResponse({'uid': uid, 'token': token})

