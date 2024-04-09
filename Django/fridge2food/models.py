from django.db import models
from django.contrib.auth.models import User


class Ingredient(models.Model):
    name = models.CharField(max_length=100)  

class Recipe(models.Model):
    recipeID = models.IntegerField(null=True)
    url = models.CharField(max_length=200, default='ph.com')
    users = models.ManyToManyField(User, related_name='saved_recipes')
    name = models.CharField(max_length=200)
    image = models.URLField(null=True, blank=True)
    total_time = models.FloatField(null=True, blank=True)


class Fridge(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)


class FridgeIngredient(models.Model):
    fridge = models.ForeignKey(Fridge, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, null=True)
    amount = models.CharField(max_length=50)