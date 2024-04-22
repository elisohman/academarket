from django.shortcuts import render
from django.http import HttpResponse, HttpRequest
from api.models import User
import json


# Create your views here.
def test(request: HttpRequest) -> HttpResponse:
    return HttpResponse("Hello world. :)")


def sign_in(request: HttpRequest) -> HttpResponse:
    """
    POST /sign_in/
        {
            "username": "<username>",
            "password": "<password>"
        }
    """
    json_string = request.body.decode()
    dictionary = json.loads(json_string)
    if "username" in dictionary:
        username = dictionary['username']
    else:
        raise ValueError("Missing username.")
    if "password" in dictionary:
        password = dictionary['password']
    else:
        # Use an empty password if none is provided
        password = ""
    user = User.objects.filter(username=username).first()
    if user:
        if user.password == password:
            return HttpResponse(status=200, content="Hello world. :)")
    print(user)
    return HttpResponse(status=400, content="Big error")


def sign_up(request: HttpRequest) -> HttpResponse:
    """
    POST /sign_up/
        {
            "username": "<username>",
            "password": "<password>"
        }
    """
    json_string = request.body.decode()
    dictionary = json.loads(json_string)
    if "username" in dictionary:
        username = dictionary['username']
    else:
        raise ValueError("Missing username.")
    if "password" in dictionary:
        password = dictionary['password']
    else:
        # Use an empty password if none is provided
        password = ""
    if User.objects.filter(username=username).exists():
        return HttpResponse(status=403, content="No!")
    new_user = User.objects.create(username=username, password=password)
    new_user.save()
    return HttpResponse(status=200, content="New user created!")