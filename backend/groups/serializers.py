from rest_framework import serializers

from invitations.models import Family
from .models import Groups, Category
from invitations.serializers import FamilySerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_author','category_title','category_note','assigned_amount','created_at','category_type','bank']
        extra_kwargs = {'category_author': {'read_only': True}}


class GroupsSerializers(serializers.ModelSerializer):
    categories = CategorySerializer(many=True)
    family = FamilySerializer()
    category_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Groups
        fields = ['id','groups_title', 'groups_author', 'created_at', 'categories', 'family', 'category_count']
        extra_kwargs = {'groups_author': {'read_only': True}}

    def create(self, validated_data):
        # Pobieranie danych z nested serializerów
        categories_data = validated_data.pop('categories')
        family_data = validated_data.pop('family')

        if isinstance(family_data, dict):
            family_name = family_data.get('name')  # Pobieranie pola 'name'
            family, created = Family.objects.get_or_create(name=family_name)
        else:
            family = family_data  # Jeśli to obiekt Family, przypisz bezpośrednio

        # Tworzenie grupy
        group = Groups.objects.create(family=family, **validated_data)

        for category_data in categories_data:
            category_data['category_author'] = validated_data['groups_author']
            category = Category.objects.create(**category_data)
            group.categories.add(category)

        return group
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['category_count'] = instance.category_count()  # Dodanie licznika kategorii
        return representation

class GroupBalanceSerializer(serializers.ModelSerializer):
    total_expenses = serializers.FloatField(source='get_total_expenses', read_only=True)
    total_income = serializers.FloatField(source='get_total_income', read_only=True)

    class Meta:
        model = Groups
        fields = ['id', 'groups_title', 'total_expenses', 'total_income']