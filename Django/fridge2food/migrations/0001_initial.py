# Generated by Django 5.0.3 on 2024-04-08 23:16

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Ingredient",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name="Fridge",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "owner",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="FridgeIngredient",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("amount", models.CharField(max_length=50)),
                (
                    "fridge",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="fridge2food.fridge",
                    ),
                ),
                (
                    "ingredient",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="fridge2food.ingredient",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Recipe",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("recipeID", models.IntegerField(null=True)),
                ("url", models.CharField(default="ph.com", max_length=200)),
                ("name", models.CharField(max_length=200)),
                ("image", models.URLField(blank=True, null=True)),
                ("total_time", models.FloatField(blank=True, null=True)),
                (
                    "users",
                    models.ManyToManyField(
                        related_name="saved_recipes", to=settings.AUTH_USER_MODEL
                    ),
                ),
            ],
        ),
    ]
