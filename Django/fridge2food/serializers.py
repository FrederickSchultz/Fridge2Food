from rest_framework import serializers
from .models import Ingredient, Recipe, Fridge, FridgeIngredient
from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'password')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        fridge = Fridge.objects.create(owner_id=user.id)
        fridge.save()
        return user

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