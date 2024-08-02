from django.shortcuts import render
from datetime import datetime, timedelta
from django.http import HttpResponse, HttpRequest, JsonResponse
from api.models import User, Course, PricePoint
from data_pipeline.utils.courses_json_utils import read_course_data_from_code, read_all_course_data, check_if_course_exists_locally, save_course_data, fill_json_from_list
from data_pipeline.utils.courses_list_utils import save_course_list, retrieve_new_data_from_liu, load_course_list
from data_pipeline.utils.database_utils import fill_database, validate_database
from data_pipeline.utils.ipo_calculation import calculate_price
import json, requests, traceback, random
from django.utils import timezone
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
        if Course.objects.filter(course_code=code).exists():
            return HttpResponse(status=403, content="Course already in the database.")
        new_course = Course.objects.create(course_code=code, name=name, price=ipo_prize)
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
    !! DEPRECIATED !!

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


def initialize_all_data(_request: HttpRequest) -> HttpResponse: 
    print("Getting course codes from LiU...")
    data_list = retrieve_new_data_from_liu()
    print("Codes gotten, saving them to file...")
    save_course_list(data_list)
    print("Codes saved! Retrieving course data...")
    courses = load_course_list()
    fill_json_from_list(courses)
    print("Course data retrieved and saved to file. Adding courses to database...")
    data = read_all_course_data()
    fill_database(data)
    print("Done! All data initialized successfully (I hope)!")
    return HttpResponse(status=202, content="Data initilization executed.")


def generate_price_histories(_request: HttpRequest) -> HttpResponse:
    print("Generating (fake) price history data...")
    PricePoint.objects.all().delete()
    courses = Course.objects.all()
    start_time = datetime.now()

    for course in courses:
        today = datetime.now()
        for i in range(1, 150):
            for j in range(1, 2):
                idate = today - timedelta(days=i) 
                idate = idate - timedelta(hours=j)
                random_price = random.randint(170, 185)
                chance = random.randint(1, 100)
                if chance <= 2:
                    random_price += random.randint(-100, 100)
                new_price_point = PricePoint(course = course, price=random_price)
                tz = timezone.get_current_timezone()
                idate = idate.replace(tzinfo=tz)
                new_price_point.date = idate
                new_price_point.save()
        course.save()
    end_time = datetime.now()
    total_seconds = (end_time - start_time).total_seconds()
    return HttpResponse(status=200, content=f'Generated price histories. Time taken: {total_seconds} seconds.')

