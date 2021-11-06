from django.http.response import HttpResponse
from django.shortcuts import render
from django.views import View

class NewCommandView(View):

    def get(self, request, *args, **kwargs):
        return HttpResponse(f"Try Using POST instead!")

    def post(self, request, *args, **kwargs):
        return HttpResponse(f"{request.data}")