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
        update_course_data(course_code, data)
        print("Data already exists in courses.json")

def update_course_data(course_code, data):
    """
    Here we want to add new exams to the course code if 
    new results for that has been released that is not 
    present in courses.json
    """
    # Define the path to the JSON file
    json_file_path = 'courses.json'
    
    # Create an empty dictionary to store course data
    local_courses_data = {}
    

    # Check if the JSON file exists
    if os.path.exists(json_file_path):
        # Read existing JSON data from the file
        with open(json_file_path, 'r', encoding='utf-8') as file:
            local_courses_data = json.load(file)
    
    exams_data = data.get('exams')
    for module_key in exams_data:
        print(module_key)
        # Checking if any examination modules needs to be added or updated
        if module_key not in local_courses_data[course_code]['exams']:
            local_courses_data[course_code]['exams'][module_key] = exams_data[module_key]
        else:
            for date_index, date_key in enumerate(exams_data[module_key]):
                if date_key not in local_courses_data[course_code]['exams'][module_key]:
                    local_courses_data[course_code]['exams'][module_key][date_key] = exams_data[module_key][date_key]

                    for data_index, data_dict in enumerate(exams_data[module_key]["data"]):
                        local_courses_data[course_code]['exams'][module_key]["data"][data_index]["data"].insert(data_dict[date_index], date_index)

    # Write new JSON data back to the file
    if local_courses_data.get(course_code) is not None:
        local_courses_data[course_code].update(data)
        # Write updated JSON data back to the file
        with open(json_file_path, 'w', encoding='utf-8') as file:
            json.dump(local_courses_data, file, ensure_ascii=False, indent=4)
            print("Data updated successfully in courses.json")
    else:
        print("Course data not found in courses.json")