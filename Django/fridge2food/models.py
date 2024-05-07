from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from annoying.fields import AutoOneToOneField



class UserAccountManager(BaseUserManager):
    def create_user(self, email, name, password=None):
        if not email:
            raise ValueError("Users must have Email and Username")

        email = self.normalize_email(email)
        user = self.model(email=email, name=name)

        user.set_password(password)
        user.save()
        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]




class Ingredient(models.Model):
    name = models.CharField(max_length=100)  

class Recipe(models.Model):


    recipeID = models.IntegerField(null=False, unique=True)
    url = models.URLField(max_length=200, default='ph.com')
    users = models.ManyToManyField(UserAccount, related_name='saved_recipes')
    name = models.CharField(max_length=200)
    image = models.URLField(null=True, blank=True)
    total_time = models.FloatField(null=True, blank=True)


class Fridge(models.Model):
    owner = AutoOneToOneField(UserAccount, on_delete=models.CASCADE)


class FridgeIngredient(models.Model):
    fridge = models.ForeignKey(Fridge, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    amount = models.IntegerField()

