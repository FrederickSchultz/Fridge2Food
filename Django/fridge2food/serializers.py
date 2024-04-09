from rest_framework import serializers
from .models import Ingredient, Recipe, Fridge, FridgeIngredient

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'
    def create(self, validated_data):
        ingredient, created = Ingredient.objects.get_or_create(**validated_data)
        return ingredient

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = '__all__'

class FridgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fridge
        fields = '__all__'

class FridgeIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = FridgeIngredient
        fields = '__all__'