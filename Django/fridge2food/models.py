from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


class Ingredient(models.Model):
    type = models.CharField(max_length=100)
    amount = models.CharField(max_length=50)  

class Recipe(models.Model):
    name = models.CharField(max_length=200)
    image = models.URLField(null=True, blank=True)
    rating = models.FloatField(null=True, blank=True) 
    total_time = models.FloatField(null=True, blank=True) 
    ingredients = models.TextField()  
    steps = models.TextField()

class User(AbstractUser): 
    favorites = models.ManyToManyField(Recipe, blank=True)
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to',
        related_name="user_set_custom",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="user_set_custom",
        related_query_name="user",
    )

class Fridge(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    ingredients = models.ManyToManyField(Ingredient)
