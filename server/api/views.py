from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from api.models import User
import json
import requests
from api.utils.handle_local_json import read_course_data_from_code, read_all_course_data, check_if_course_exists_locally, save_course_data

#-- Views! --#

def test(request: HttpRequest) -> HttpResponse:
    return HttpResponse("Hello world. :)")

# Account related views (sign in, sign out, etc).

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
            return HttpResponse(status=200, content="User logged in!")
        return HttpResponse(status=403, content="Wrong password.")

    return HttpResponse(status=404, content="User does not exist.")


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
        # Use an empty password if none is provided. Temporary solution!
        password = ""
    if User.objects.filter(username=username).exists():
        return HttpResponse(status=403, content="No!")
    new_user = User.objects.create(username=username, password=password)
    new_user.save()
    return HttpResponse(status=200, content="New user created!")


# Views for robbing y-sektionen

def get_course_stats(_request: HttpRequest, course_code: str) -> JsonResponse:
    """
    Stealing statistics for a given course from a certain API, saving it locally if necessary.

    Args:
        _request (HttpRequest): The HTTP request object.
        course_code (str): The code of the course for which to retrieve the statistics.

    Returns:
        JsonResponse: The JSON response containing the course statistics.

    Raises:
        JsonResponse: If there is an error retrieving or saving the course statistics.
    """
    should_update = False # Temporary placement, for when we want to check for new exams in courses already in the database
    api_url = f"https://ysektionen.se/student/tentastatistik/exam_stats/?course_code={course_code}&newer_than=2012&month_lb=&month_ub="
    try:
        if check_if_course_exists_locally(course_code) and not should_update:
            data = read_course_data_from_code(course_code)
            return JsonResponse(data, status=200)
        
        # Making a GET request to the API
        response = requests.get(api_url)

        if response.status_code == 200:
            data = response.json()
            
            save_course_data(data)

            return JsonResponse(data, status=200)
        else:
            return JsonResponse({'error': 'Failed to fetch data from the API'}, status=500)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def get_local_course_data(_request: HttpRequest) -> JsonResponse:
    """
    Retrieve local course data and return it as a JSON response.

    Parameters:
    - _request (HttpRequest): The HTTP request object. Unused.

    Returns:
    - JsonResponse: The JSON response containing the local course data.

    """
    local_courses_data = read_all_course_data()
    if local_courses_data:
        return JsonResponse(local_courses_data, status=200)
    return JsonResponse({'error': 'No data available'}, status=404)