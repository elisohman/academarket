#from handle_local_json import read_all_course_data
import requests


def make_external_api_call(course_code):
    # API endpoint URL
    external_api_url = f"http://127.0.0.1:8000/api/add_course_to_database/{course_code}"
    # Send a GET request to the API endpoint
    response = requests.get(external_api_url)
    # Check if the request was successful
    if response.status_code != 200:
        print(f"Failed to add via own API: {response.status_code}")


def fill_database(data):
    print(data)
    for course in data:
        make_external_api_call(course)


