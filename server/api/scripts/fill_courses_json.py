
from server.api.utils.courses_list_utils import load_course_list
import requests


def make_external_api_call(course_code):
    # API endpoint URL
    external_api_url = f"http://127.0.0.1:8000/api/get_course_stats/{course_code}"
    # Send a GET request to the API endpoint
    response = requests.get(external_api_url)
    # Check if the request was successful
    if response.status_code == 200:
        print("Success!")
    else:
        print(f"Failed to retrieve data from API. Status code: {response.status_code}")

if __name__ == "__main__":
    courses = load_course_list()
    for course in courses:
        make_external_api_call(course.strip())
        

