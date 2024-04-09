from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Ingredient, Recipe, Fridge, FridgeIngredient
from .serializers import IngredientSerializer, RecipeSerializer, FridgeIngredientSerializer, FridgeSerializer


class Ingredient(APIView):
    def get(self, request):
        ingredients = Ingredient.objects.all()
        serializer = IngredientSerializer(ingredients, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = IngredientSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

class Recipes(APIView):
    def get(self, request):
        recipes = Recipe.objects.all()
        serializer = RecipeSerializer(recipes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RecipeSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        

class Fridges(APIView):
    def get(self, request):
        fridges = Fridge.objects.all()
        serializer = FridgeSerializer(fridges, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FridgeSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        

class FridgeIngredientView(APIView):
    def get(self, request, fridge_id):
        fridge_ingredients = FridgeIngredient.objects.filter(fridge__id=fridge_id)
        serializer = FridgeIngredientSerializer(fridge_ingredients, many=True)
        return Response(serializer.data)


    def post(self, request, fridge_id):
        data = request.data
        data['fridge'] = fridge_id  
        serializer = FridgeIngredientSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)


    def update(self, request, fridge_id, pk):
        try:
            fridge_ingredient = FridgeIngredient.objects.get(pk=pk, fridge__id=fridge_id)
        except FridgeIngredient.DoesNotExist:
            return Response({'error': 'FridgeIngredient not found.'})

        serializer = FridgeIngredientSerializer(fridge_ingredient, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)



