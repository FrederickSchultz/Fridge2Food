from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
#from apiKeys import *
import json
# Create your views here.


class RecipesWithIng(APIView):
    def get(self, request, fridge_id):

        return Response("success")