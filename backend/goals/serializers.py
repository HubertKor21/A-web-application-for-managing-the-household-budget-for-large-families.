from rest_framework import serializers
from .models import SavingsGoal

class SavingsGoalSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()

    class Meta:
        model = SavingsGoal
        fields = ['id', 'title', 'goal_type', 'target_amount', 'current_amount', 'due_date', 'user', 'created_at', 'progress']
        read_only_fields = ['id', 'created_at', 'progress']
    
    def get_progress(self, obj):
        return obj.progress()

    def validate_target_amount(self, value):
        """Walidacja celu oszczędnościowego, aby kwota nie była ujemna."""
        if value < 0:
            raise serializers.ValidationError("Kwota celu nie może być mniejsza niż 0.")
        return value

    def validate_current_amount(self, value):
        """Walidacja zgromadzonej kwoty, aby nie była ujemna."""
        if value < 0:
            raise serializers.ValidationError("Kwota zgromadzona nie może być mniejsza niż 0.")
        return value