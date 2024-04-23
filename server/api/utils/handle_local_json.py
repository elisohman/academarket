import os
import json

def read_course_data_from_code(course_code):
    # Define the path to the JSON file
    json_file_path = 'courses.json'
    
    # Check if the JSON file exists
    if os.path.exists(json_file_path):
        # Read existing JSON data from the file
        with open(json_file_path, 'r', encoding='utf-8') as file:
            local_courses_data = json.load(file)
            return local_courses_data.get(course_code)
    return None



def read_all_course_data():
    # Define the path to the JSON file
    json_file_path = 'courses.json'
    
    # Check if the JSON file exists
    if os.path.exists(json_file_path):
        # Read existing JSON data from the file
        with open(json_file_path, 'r', encoding='utf-8') as file:
            local_courses_data = json.load(file)
            return local_courses_data
    return None



def check_if_course_exists_locally(course_name):
    # Define the path to the JSON file
    json_file_path = 'courses.json'
    
    # Check if the JSON file exists
    if os.path.exists(json_file_path):
        # Read existing JSON data from the file
        with open(json_file_path, 'r', encoding='utf-8') as file:
            local_courses_data = json.load(file)
            return local_courses_data.get(course_name) is not None
    return False


def save_course_data(data):
    # Define the path to the JSON file
    json_file_path = 'courses.json'
    
    # Create an empty dictionary to store course data
    local_courses_data = {}
    
    # Check if the JSON file exists
    if os.path.exists(json_file_path):
        # Read existing JSON data from the file
        with open(json_file_path, 'r', encoding='utf-8') as file:
            local_courses_data = json.load(file)
    
    # Add or update course data
    course_code = data.get('course_code')
    if local_courses_data.get(course_code) is None:
        local_courses_data[course_code] = data
        # Write updated JSON data back to the file
        with open(json_file_path, 'w', encoding='utf-8') as file:
            json.dump(local_courses_data, file, ensure_ascii=False, indent=4)
            print("Data saved successfully to courses.json")
    else:
        print("Data already exists in courses.json")