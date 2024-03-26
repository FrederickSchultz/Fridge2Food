from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from allrecipes import AllRecipes


# Create your views here.

class getRecpies(APIView):
    def get(self, request, searchTerm, num):
        query_result = AllRecipes.search(searchTerm)
        output = []
        for i in range(num):
            output.append(query_result[i]['url'])

        return Response(output)
