from django.http import HttpResponse, HttpRequest, JsonResponse
from api.models import User, Course
from api.utils.courses_json_utils import read_course_data_from_code, read_all_course_data, check_if_course_exists_locally, save_course_data, fill_json_from_list
from api.utils.courses_list_utils import save_course_list, retrieve_new_data_from_liu, load_course_list
from api.utils.database_utils import fill_database
from api.utils.ipo_calculation import calculate_price
import json, requests, traceback


#-- Views! --#


def test(request: HttpRequest) -> HttpResponse:
    return HttpResponse("Hello world. :)")


# Account related views (sign in, sign out, etc).


def sign_in(request: HttpRequest) -> HttpResponse:
    """
    Sign in a user.

    Parameters:
    - request (HttpRequest): The HTTP request.

    Returns:
    - HttpResponse: The HTTP response indicating whether the user was signed in successfully.

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
    Sign up view. Creates a new user.

    Parameters:
    - request (HttpRequest): The HTTP request.
    - username (str): The username of the new user.

    Returns:
    - HttpResponse: The HTTP response indicating whether the user was created successfully.

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
    return HttpResponse(status=201, content="New user created!")


# Views for robbing y-sektionen


def get_course_stats(_request: HttpRequest, course_code: str) -> JsonResponse:
    """
    Stealing statistics for a given course from a certain API, saving it locally if necessary.

    Args:
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

            return JsonResponse(data, status=201)
        else:
            print("Blocked!")
            return JsonResponse({'error': 'Failed to fetch data from the API'}, status=500)
    except Exception as e:
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)


def fill_courses_json(_request: HttpRequest) -> HttpResponse:
    """
    Fill the local JSON file with course data. Calls script in courses_json_utils.py.

    Returns:
    - HttpResponse: HTTP response indicating that the script has been executed.

    """
    courses = load_course_list()
    fill_json_from_list(courses)
    return HttpResponse(status=202, content="Script to add JSON course data from course codes in text file executed.")


def fill_course_codes_list(_request: HttpRequest) -> HttpResponse:
    """
    Fill the local list (stored as a txt file) with course codes. Calls script in courses_list_utils.py.
    Note: requires BeautifulSoup to be installed!

    Returns:
    - HttpResponse: HTTP response indicating that the script has been executed.

    """
    data_list = retrieve_new_data_from_liu()
    # Save data_list to a local file
    save_course_list(data_list)
    print("Data retrieved and saved to file.")
    return HttpResponse(status=202, content="Script to add course codes to the text file executed.")


# Views for retrieving local course data


def get_local_course_stats(_request: HttpRequest, course_code: str) -> JsonResponse:
    """
    Retrieve local course statistics and return them as a JSON response.

    Parameters:
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

    Returns:
    - JsonResponse: The JSON response containing the local course data.

    """
    local_courses_data = read_all_course_data()
    if local_courses_data:
        return JsonResponse(local_courses_data, status=200)
    return JsonResponse({'error': 'No data available'}, status=404)


# View for handling database


def add_course_to_database(_request: HttpRequest, course_code: str) -> HttpResponse:
    """
    Add a course to the local database.

    Parameters:
    - course_code (str): The code of the course to add.
    - course_name (str): The name of the course to add.

    Returns:
    - HttpResponse: The HTTP response indicating whether the course was added successfully.

    """
    course_data = read_course_data_from_code(course_code)
    
    if course_data:
        ipo_prize = calculate_price(course_data)
        code = course_data['course_code']
        name = course_data['course_name']
        description = "This is a course."
        if Course.objects.filter(course_code=code).exists():
            return HttpResponse(status=403, content="Course already in the database.")
        new_course = Course.objects.create(course_code=code, name=name, description=description, price=ipo_prize)
        new_course.save()
        return HttpResponse(status=201, content="Course added to the database.")
    return HttpResponse(status=404, content="Course not found in local JSON.")


def fill_courses_database(_request: HttpRequest) -> HttpResponse:
    """
    Fill the local database with course data. Calls script in database_utils.py.
    
    Returns:
    - HttpResponse: HTTP response indicating that the script has been executed.

    """
    data = read_all_course_data()
    fill_database(data)
    return HttpResponse(status=202, content="Script to fill database with courses executed.")


def buy_course_test(_request: HttpRequest, course_code: str, user: str) -> JsonResponse:
    """
    Buy a course by adding it to the user's list of courses. Temporary implementation.

    Parameters:
    - course_code (str): The code of the course to buy.

    Returns:
    - JsonResponse: The JSON response indicating whether the course was bought successfully.

    """
    # Temporary solution
    current_user = User.objects.filter(username=user).first()
    course = Course.objects.filter(course_code=course_code).first()
    if not current_user or not course:
        return JsonResponse({'message': 'User or course not found.'}, status=404)
    if course in current_user.courses.all():
        return JsonResponse({'message': 'Course already bought.'}, status=200)
    current_user.courses.add(course)
    current_user.save()
    return JsonResponse({'message': 'Course bought successfully!'}, status=200)

