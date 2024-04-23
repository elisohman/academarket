from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from api.models import User
import json
import requests
from api.utils.handle_local_json import read_course_data_from_code, read_all_course_data, check_if_course_exists_locally, save_course_data

# Account related (sign in, sign out, etc).
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


# Stealing from ysektionen

def get_course_stats(request: HttpRequest, course_code: str) -> HttpResponse:
    # Define the URL of the API endpoint
    params = request.GET.dict()
    api_url = f"https://ysektionen.se/student/tentastatistik/exam_stats/?course_code={course_code}&newer_than=2012&month_lb=&month_ub="
    try:
        #if not read_all_course_data():
        #    course_code = "TATA24" # just to make sure it creates the json file correctly
            #return HttpResponse(status=500, content="Get out!")
        if check_if_course_exists_locally(course_code):
            data = read_course_data_from_code(course_code)
            return JsonResponse(data, status=200)
        # Make a GET request to the API
        response = requests.get(api_url)

        # Check if the request was successful
        if response.status_code == 200:
            # Parse JSON response
            data = response.json()
            
            save_course_data(data)

            # Return the JSON response
            return JsonResponse(data)
        else:
            # If the request was not successful, return an error response
            return JsonResponse({'error': 'Failed to fetch data from the API'}, status=500)
    except Exception as e:
        # If an exception occurs, return an error response
        return JsonResponse({'error': str(e)}, status=500)


def get_local_course_data(request):
    # Define the path to the JSON file
    local_courses_data = read_all_course_data()
    # Check if the JSON file exists
    if local_courses_data:
        return JsonResponse(local_courses_data, status=200)
    return JsonResponse({'error': 'No data available'}, status=404)

