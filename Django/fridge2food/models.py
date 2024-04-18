from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin, BaseUserManager



class UserManager(BaseUserManager):
    def create_user(self, username, email, first_name="", last_name="", password=None):
        if not email or not username:
            raise ValueError("Users must have Email and Username")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, first_name=first_name, last_name=last_name)

        user.set_password(password)
        user.save()
        return user


class User(AbstractUser, PermissionsMixin):
    username = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_staff = models.BooleanField(default=False)


    objects = UserManager()


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
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    amount = models.IntegerField()

