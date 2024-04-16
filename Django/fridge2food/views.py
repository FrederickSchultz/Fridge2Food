from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
import requests as r
from django.conf import settings
import json
from .models import *
from .serializers import *
# Create your views here.

spoonApiKey = settings.SPOON_API_KEY

class RecipesWithIng(APIView):
    def get(self, request):
        random = request.GET.get('random', False)
        fridge_id = int(request.GET.get('fridgeId', -1))
        if random:
            headers = {'x-api-key': spoonApiKey}
            randomRecipes = json.loads(r.get('https://api.spoonacular.com/recipes/random?number=10', headers=headers).text)
            output = [{
                'recipe_Id': recipe["id"],
                'image': recipe["image"],
                'name': recipe["title"],
                'url': recipe["sourceUrl"]

            } for recipe in randomRecipes["recipes"]]

            return Response(output)

        if fridge_id > 0:
            fridge = Fridge.objects.get(id=fridge_id)
            if fridge is not None:
                fridgeIngredents = []
                for ingredent in fridge.fridgeingredient_set.all():
                    name = ingredent.ingredient.name
                    fridgeIngredents.append(name)
                Ingparam = ",+".join(fridgeIngredents)
                headers = {'x-api-key': spoonApiKey}
                recipes = json.loads(r.get('https://api.spoonacular.com/recipes/findByIngredients?ingredients={}&ranking=2&ignorePantry=true'.format(Ingparam), headers=headers).text)
                output = [{
                    'recipe_Id': recipe["id"],
                    'image': recipe["image"],
                    'name': recipe["title"],
                    'numMissing': recipe["missedIngredientCount"]

                } for recipe in recipes]
                ids = []

                for recipe in output:
                    ids.append(str(recipe["recipe_Id"]))
                idparam = ','.join(ids)

                recipeData = json.loads(r.get('https://api.spoonacular.com/recipes/informationBulk?ids={}'.format(idparam), headers=headers).text)
                for i in range(len(recipeData)):
                    output[i]["url"] = recipeData[i]["sourceUrl"]

                return Response(output)


        return Response("No params")


class Users(APIView):
    def get(self, request):
        user = User.objects.all()
        serializer = UserSerializer(user, many=True)
        return Response(serializer.data)

    def update(self, request, userid):
        user = User.objects.get(id=userid)
        data = request.data
        print("made it")
        if user is not None:
            for key in data.keys():
                if key == 'password':
                    user.password = data[key]
                if key == 'username':
                    user.username = data[key]
                if key == 'first_name':
                    user.first_name = data[key]
                if key == 'last_name':
                    user.last_name = data[key]
                if key == 'email':
                    user.email = data[key]

            user.save()
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data)
    def post(self, request):
        userid = int(request.GET.get("userid", -1))
        print(userid)
        if userid > 0:
            return self.update(request, userid)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)



class IngredientView(APIView):
    def get(self, request):
        ing_id = int(request.GET.get("ingId", -1))
        if ing_id > 0:
            ingredients = Ingredient.objects.get(id=ing_id)
            serializer = IngredientSerializer(ingredients, many=False)
            return Response(serializer.data)
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
        recipe_id = int(request.GET.get("recipeId", -1))
        if recipe_id > 0:
            recipe = Recipe.objects.get(id=recipe_id)
            serializer = IngredientSerializer(recipe, many=False)
            return Response(serializer.data)
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
    
    def delete(self, request):
        ing_id = request.GET.get("ingId")
        if ing_id:
            ingredient = Ingredient.objects.get(id=ing_id)
            ingredient.delete()
            return Response("successful")



