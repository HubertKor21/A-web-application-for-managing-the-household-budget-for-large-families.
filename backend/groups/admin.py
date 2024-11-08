from django.contrib import admin
from .models import Groups, Category
from django.db.models import Sum
from django.db import models
# Inline model for Categories within Groups
class CategoryInline(admin.TabularInline):
    model = Groups.categories.through  # This is the through model for ManyToMany relationships
    extra = 1  # Number of empty forms to display by default
    fields = ('category_title', 'category_type', 'assigned_amount', 'category_author')  # Fields to show in the inline form

# CategoryAdmin with enhanced functionality
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_title', 'category_type', 'assigned_amount', 'category_author', 'created_at', 'get_total_assigned_amount')
    
    # Search fields to search by category title and category author (username)
    search_fields = ('category_title', 'category_author__username')  # Allows search by category title and author username

    # Filters to filter categories by type and author
    list_filter = ('category_type', 'category_author', 'created_at')

    # Optionally, add pagination settings for large datasets
    list_per_page = 25  # Adjust the number of categories displayed per page

    # Method to compute the total assigned amount dynamically (sum of assigned amounts)
    @admin.display(description='Total Assigned Amount')
    def get_total_assigned_amount(self, obj):
        """Calculate and display the total assigned amount for the category"""
        # If needed, you can calculate the total amount for related instances
        return obj.assigned_amount  # Directly display the assigned amount for simplicity

    # Form customization (e.g., for more user-friendly input in the admin)
    formfield_overrides = {
        models.FloatField: {'widget': admin.widgets.AdminDateWidget},
    }

    # Custom method to save the category and update related bank balances
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        # If the category type is expense, we might need to adjust bank balances
        if obj.category_type == 'expense' and obj.bank:
            obj.bank.balance -= obj.assigned_amount
            obj.bank.save()

    # Custom actions for the Category model
    actions = ['mark_categories_as_expense']

    # Action to mark selected categories as expenses
    def mark_categories_as_expense(self, request, queryset):
        updated_count = queryset.update(category_type='expense')  # Update category type to expense
        self.message_user(request, f"{updated_count} categories marked as expenses.")
    
    mark_categories_as_expense.short_description = "Mark selected categories as Expenses"

class GroupsAdmin(admin.ModelAdmin):
    list_display = ('groups_title', 'created_at', 'groups_author', 'family', 'get_total_expenses', 'get_total_income', 'get_balance')
    
    # Search fields to search by group title
    search_fields = ('groups_title', 'groups_author__username')  # Search by title and author username

    # Filters to filter groups by creation date, family, and author
    list_filter = ('created_at', 'family', 'groups_author')

    # Add the inline for categories to be edited within the group
    inlines = [CategoryInline]

    # Actions for batch updates or custom actions
    actions = ['mark_groups_as_active']

    # Custom method for action (e.g., Mark groups as active)
    def mark_groups_as_active(self, request, queryset):
        # This assumes you have a field 'active' on Groups
        queryset.update(active=True)
        self.message_user(request, "Selected groups have been marked as active.")

    mark_groups_as_active.short_description = "Mark selected groups as active"

    # Method to compute total expenses dynamically
    @admin.display(description='Total Expenses')
    def get_total_expenses(self, obj):
        """Calculate and display the total expenses for a group"""
        return obj.get_total_expenses()  # Calling the model method

    # Method to compute total income dynamically
    @admin.display(description='Total Income')
    def get_total_income(self, obj):
        """Calculate and display the total income for a group"""
        return obj.get_total_income()  # Calling the model method

    # Method to compute balance dynamically (income - expenses)
    @admin.display(description='Balance')
    def get_balance(self, obj):
        """Calculate and display the balance (income - expenses)"""
        return obj.get_balance()  # Calling the model method

    # Optionally, add pagination settings for large datasets
    list_per_page = 25  # Adjust the number of groups displayed per page

# Registering models with the admin interface
admin.site.register(Groups, GroupsAdmin)
admin.site.register(Category, CategoryAdmin)
