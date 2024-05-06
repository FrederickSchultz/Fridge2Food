from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
import requests as r
from django.conf import settings
import json
from .models import *
from .serializers import *
import os

# Create your views here.

spoonApiKey = settings.SPOON_API_KEY


class RecipesWithIng(APIView):
    def get(self, request):
        random = request.GET.get('random', False)
        fridge_id = int(request.GET.get('fridgeId', -1))
        searchQuery = request.GET.get('searchQuery', "")
        if random:
            headers = {'x-api-key': spoonApiKey}
            # randomRecipes = json.loads(r.get('https://api.spoonacular.com/recipes/random?number=10', headers=headers).text)
            # json_recipes = json.dumps(randomRecipes, indent=4)
            # with open("randomRecipes.json", "w") as outfile:
            # outfile.write(json_recipes)

            file_ = open(os.path.join(settings.PROJECT_ROOT, 'randomRecipes.json'))
            randomRecipes = json.load(file_)
            file_.close()
            output = [{
                'recipe_Id': recipe["id"],
                'image': recipe["image"],
                'name': recipe["title"],
                'url': recipe["sourceUrl"]

            } for recipe in randomRecipes["recipes"]]

            return Response(output)

        if fridge_id > 0 and searchQuery == "":
            fridge = Fridge.objects.get(id=fridge_id)
            if fridge is not None:
                fridgeIngredents = []
                for ingredent in fridge.fridgeingredient_set.all():
                    name = ingredent.ingredient.name
                    fridgeIngredents.append(name)
                Ingparam = ",+".join(fridgeIngredents)
                headers = {'x-api-key': spoonApiKey}
                recipes = json.loads(r.get(
                    'https://api.spoonacular.com/recipes/findByIngredients?ingredients={}&ranking=2&ignorePantry=true'.format(
                        Ingparam), headers=headers).text)
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

                recipeData = json.loads(
                    r.get('https://api.spoonacular.com/recipes/informationBulk?ids={}'.format(idparam),
                          headers=headers).text)
                for i in range(len(recipeData)):
                    output[i]["url"] = recipeData[i]["sourceUrl"]

                return Response(output)

        if not searchQuery == "":
            headers = {"x-api-key": spoonApiKey}
            searchedRecipies = None
            if fridge_id == -1:
                searchedRecipies = json.loads(r.get(
                    'https://api.spoonacular.com/recipes/complexSearch?query={}&addRecipeInformation=true&number=5'.format(
                        searchQuery), headers=headers).text)
            else:
                fridge = Fridge.objects.get(id=fridge_id)
                if fridge is not None:
                    fridgeIngredents = []
                    for ingredent in fridge.fridgeingredient_set.all():
                        name = ingredent.ingredient.name
                        fridgeIngredents.append(name)
                    Ingparam = ",".join(fridgeIngredents)
                    searchedRecipies = json.loads(r.get(
                        'https://api.spoonacular.com/recipes/complexSearch?query={}&addRecipeInformation=true&number=5&includeIngredients={}'.format(
                            searchQuery, Ingparam), headers=headers).text)
            if not searchedRecipies is None:
                output = [{
                    'recipe_Id': recipe["id"],
                    'image': recipe["image"],
                    'name': recipe["title"],
                    'url': recipe["sourceUrl"]

                } for recipe in searchedRecipies["results"]]

                return Response(output)

        return Response("No params")


class Users(APIView):
    def get(self, request):
        userid = int(request.GET.get("userid", -1))
        if userid > 0:
            user = UserAccount.objects.get(id=userid)
            serializer = UserSerializer(user, many=False)
            returnData = serializer.data
            returnData["saved_recipes"] = [recipe.id for recipe in user.saved_recipes.all()]
            returnData["fridgeId"] = user.fridge.id
            return Response(returnData)
        user = UserAccount.objects.all()
        serializer = UserSerializer(user, many=True)
        return Response(serializer.data)

    def put(self, request):
        userid = int(request.GET.get("userid", -1))
        if userid > 0:
            user = UserAccount.objects.get(id=userid)
            data = request.data
            if user is not None:
                serializer = UserSerializer(user, data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)

        return Response("No User ID provided")

    def post(self, request):
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
            serializer = RecipeSerializer(recipe, many=False)
            return Response(serializer.data)
        recipes = Recipe.objects.all()
        serializer = RecipeSerializer(recipes, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        userIndex = data.pop("users")
        serializer = RecipeSerializer(data=data, partial=True)
        print(data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            recipe = Recipe.objects.get(id=serializer.data["id"])
            recipe.users.add(UserAccount.objects.get(id=userIndex))
            recipe.save()
            return Response(serializer.data)
    def delete(self, request):
        data = request.data
        recipe = Recipe.objects.get(recipeID=data["recipe_Id"])
        if recipe:
            recipe.delete()
            return Response("Successfull")
        return Response("Couldnt Find recipe")


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

    def put(self, request, fridge_id):
        try:
            pk = int(request.GET.get("fIngId", -1))
            fridge_ingredient = FridgeIngredient.objects.get(pk=pk, fridge__id=fridge_id)
        except FridgeIngredient.DoesNotExist:
            return Response({'error': 'FridgeIngredient not found.'})

        serializer = FridgeIngredientSerializer(fridge_ingredient, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

    def delete(self, request, fridge_id):
        pk = int(request.GET.get("fIngId"))
        if pk:
            print([fid.id for fid in FridgeIngredient.objects.all()])
            fridge_ingredient = FridgeIngredient.objects.get(id=pk)

            fridge_ingredient.delete()
            return Response("successful")
