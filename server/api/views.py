from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from api.models import User, Course
from api.utils.courses_json_utils import read_course_data_from_code, read_all_course_data, check_if_course_exists_locally, save_course_data

from api.utils.database_utils import fill_database

import json
import requests

import traceback
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
        if not should_update:
            if check_if_course_exists_locally(course_code):
                data = read_course_data_from_code(course_code)
                return JsonResponse(data, status=200)
        
        # Making a GET request to the API
        response = requests.get(api_url)

        if response.status_code == 200:
            data = response.json()
            
            save_course_data(data)

            return JsonResponse(data, status=200)
        else:
            print("Blocked!")
            return JsonResponse({'error': 'Failed to fetch data from the API'}, status=500)
    except Exception as e:
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)

# Views for retrieving local course data

def get_local_course_stats(_request: HttpRequest, course_code: str) -> JsonResponse:
    """
    Retrieve local course statistics and return them as a JSON response.

    Parameters:
    - _request (HttpRequest): The HTTP request object. Unused.
    - course_code (str): The code of the course for which to retrieve the statistics.

    Returns:
    - JsonResponse: The JSON response containing the course statistics.

    """
    local_course_data = read_course_data_from_code(course_code)
    if local_course_data:
        return JsonResponse(local_course_data, status=200)
    return JsonResponse({'error': 'No data available'}, status=404)

def get_all_local_data(_request: HttpRequest) -> JsonResponse:
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

def add_course_to_database(_request: HttpRequest, course_code: str) -> HttpResponse:
    """
    Add a course to the local database.

    Parameters:
    - _request (HttpRequest): The HTTP request object.
    - course_code (str): The code of the course to add.
    - course_name (str): The name of the course to add.

    Returns:
    - HttpResponse: The HTTP response indicating whether the course was added successfully.

    """
    course_data = read_course_data_from_code(course_code)
    if course_data:
        code = course_data['course_code']
        name = course_data['course_name']
        description = "This is a course."
        if Course.objects.filter(course_code=code).exists():
            print(f"Course {code} already in the database.")
            return HttpResponse(status=200, content="Course already in the database.")
        new_course = Course.objects.create(course_code=code, name=name, description=description, price=1)
        new_course.save()
        print(f"Course {code} added!")
        return HttpResponse(status=200, content="Course added to the database.")
    return HttpResponse(status=404, content="Course not found.")

def fill_courses_database(_request: HttpRequest) -> HttpResponse:
    data = read_all_course_data()
    """for course in data:
        #print(data[course])
        course_code = data[course]['course_code']
        course_name = data[course]['course_name']
        course_description = "This is a course."
        new_course = Course.objects.create(course_code=course_code, name=course_name, description=course_description, price=1)
        new_course.save()"""
    fill_database(data)
    return HttpResponse(status=200, content="Courses added to the database.")

def buy_course_test(_request: HttpRequest, course_code: str, user: str) -> JsonResponse:
    """
    Buy a course by adding it to the user's list of courses.

    Parameters:
    - _request (HttpRequest): The HTTP request object.
    - course_code (str): The code of the course to buy.

    Returns:
    - JsonResponse: The JSON response indicating whether the course was bought successfully.

    """
    # Temporary solution
    current_user = User.objects.filter(username=user).first()
    course = Course.objects.filter(course_code=course_code).first()
    if not current_user or not course:
        return JsonResponse({'message': 'User or course not found'}, status=404)
    if course in current_user.courses.all():
        return JsonResponse({'message': 'Course already bought'}, status=200)
    current_user.courses.add(course)
    current_user.save()
    return JsonResponse({'message': 'Course bought successfully'}, status=200)
