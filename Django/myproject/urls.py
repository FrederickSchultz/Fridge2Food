"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from fridge2food.views import *
from django.urls import path, include
from  fridge2food.views import *


urlpatterns = [
    path("admin/", admin.site.urls),
    path("recipes", RecipesWithIng.as_view(), name="Recipes from api"),
    path('Ingredient', IngredientView.as_view(), name="Ingredient"),
    path('Recipe', Recipes.as_view(), name="Recipe"),
    path('Fridge/', Fridges.as_view(), name="Fridge"),
    path('fridgeIngredients/<int:fridge_id>', FridgeIngredientView.as_view(), name="addIngredient"),
    path('Users', Users.as_view(), name="users")
]
