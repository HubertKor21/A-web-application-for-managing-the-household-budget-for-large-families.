from rest_framework import serializers
from .models import Groups, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_author','category_title','category_note','assigned_amount','created_at']

class GroupsSerializers(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = Groups
        fields = ['groups_title','groups_author','created_at','category']
        extra_kwargs = {'groups_author': {'read_only':True}}

    def create(self, validated_data):

        category_data = validated_data.pop('category',None)

        if not category_data:
            raise serializers.ValidationError({"category": "Category is required"})

        if category_data:
            category, created = Category.objects.get_or_create(**category_data)
            validated_data['category'] = category
        
        return Groups.objects.create(**validated_data)