from django.contrib import admin
from .models import Groups, Category

class GroupsAdmin(admin.ModelAdmin):
    list_display = ('groups_title', 'created_at', 'groups_author', 'family', 'get_total_expenses', 'get_total_income')

    # Można dodać dodatkowe opcje, takie jak filtry lub wyszukiwanie:
    search_fields = ('groups_title',)
    list_filter = ('created_at', 'family')

admin.site.register(Groups, GroupsAdmin)
admin.site.register(Category)
