import os
import json
import shutil
import datetime
import requests

JSON_PATH = 'course_data/courses.json'
BACKUP_PATH = 'course_data/courses_backups'

def read_course_data_from_code(course_code):
    """
    Read course data from the local JSON file using the course code as a key.
    """
    # Define the path to the JSON file
    json_file_path = JSON_PATH
    
    # Check if the JSON file exists
    if os.path.exists(json_file_path):
        # Read existing JSON data from the file
        with open(json_file_path, 'r', encoding='utf-8') as file:
            local_courses_data = json.load(file)
            return local_courses_data.get(course_code)
    return None


def read_all_course_data():
    """
    Returns all data found in the local JSON file.
    """
    # Define the path to the JSON file
    json_file_path = JSON_PATH    
    # Check if the JSON file exists
    if os.path.exists(json_file_path):
        # Read existing JSON data from the file
        with open(json_file_path, 'r', encoding='utf-8') as file:
            local_courses_data = json.load(file)
            return local_courses_data
    return None



def check_if_course_exists_locally(course_name):
    """
    Checks if a course exists in the local JSON file.
    """
    # Define the path to the JSON file
    json_file_path = JSON_PATH
    
    # Check if the JSON file exists
    if os.path.exists(json_file_path):
        # Read existing JSON data from the file
        with open(json_file_path, 'r', encoding='utf-8') as file:
            local_courses_data = json.load(file)
            return local_courses_data.get(course_name) is not None
    return False


def save_course_data(data):
    """
    Save course data to the local JSON file. If the course already exists, update the data.
    """
    # Define the path to the JSON file
    json_file_path = JSON_PATH
    
    # Create an empty dictionary to store course data
    local_courses_data = {}
    
    # Check if the JSON file exists
    if os.path.exists(json_file_path):
        # Create a backup of the existing local_courses_data
        backup_folder = BACKUP_PATH
        backup_file_name = f'courses_backup_{datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")}.json'
        backup_file_path = os.path.join(backup_folder, backup_file_name)
        if not os.path.exists(backup_folder):
            os.makedirs(backup_folder)
        shutil.copyfile(json_file_path, backup_file_path)

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
            print("New data saved successfully to courses.json")
    else:
        print("Data already exists in courses.json, checking for update...")
        update_course_data(course_code, data)



def update_course_data(course_code, data):
    """
    Here we want to add new exams to the course code if 
    new results for that has been released that is not 
    present in courses.json, as well as to correct any
    inconsistencies in the data.
    """
    # Define the path to the JSON file
    json_file_path = JSON_PATH
    
    # Create an empty dictionary to store course data
    local_courses_data = {}
    

    # Check if the JSON file exists
    if os.path.exists(json_file_path):
        # Read existing JSON data from the file
        with open(json_file_path, 'r', encoding='utf-8') as file:
            local_courses_data = json.load(file)
    
    exams_data = data.get('exams')
    for module_key in exams_data:
        # Checking if any examination modules needs to be added or updated
        if module_key not in local_courses_data[course_code]['exams']:
            print(f"Adding module {module_key} to {course_code}...")
            local_courses_data[course_code]['exams'][module_key] = exams_data[module_key]
        else:
            for data_index, data_dict in enumerate(exams_data[module_key]['data']):
                    new_dict = get_grade_data_dict_on_date(exams_data[module_key], data_index)
                    local_dict = get_grade_data_dict_on_date(local_courses_data[course_code]['exams'][module_key], data_index)
                    local_dict.update(new_dict)
                    updated_dates = list(local_dict.keys())
                    updated_results =  list(local_dict.values())
                    
                    local_courses_data[course_code]['exams'][module_key]['data'][data_index]['data'] = updated_results
                    local_courses_data[course_code]['exams'][module_key]['dates'] = updated_dates

    # Checkin if the data is correctly updated
    if local_courses_data.get(course_code) == data:
        print("Local data correctly updated!")
    else:
        print("Local data not correctly updated :(")
        print("Trying to sort the data...")
        local_courses_data = sort_local_course_exams_data(local_courses_data, course_code)
        if local_courses_data.get(course_code) == data:
            print("Data correct after sorting!")
        else:
            print("Still incorrect data after sorting? Should not happen... \
                   Or should only happen when we have data not present in the \
                   API anymore, if our database is still correct. \
                   Either way, further implementation is probably needed.")
    # Write new JSON data back to the file
    if local_courses_data.get(course_code) is not None:
        # local_courses_data[course_code].update(data) # Can I just use this instead????
        # Write updated JSON data back to the file
        with open(json_file_path, 'w', encoding='utf-8') as file:
            json.dump(local_courses_data, file, ensure_ascii=False, indent=4)
            print("Data updated successfully in courses.json")
    else:
        print("Course data not found in courses.json")



def sort_local_course_exams_data(local_courses_data, course_code):
    """
    Sorts the exam data by date.
    """
    local_exams_data = local_courses_data.get(course_code)['exams']
    for module_key in local_exams_data:
        sorted_dict = get_module_data_dict_on_date(local_exams_data[module_key])
        sorted_dates = list(sorted_dict.keys())
        sorted_data = {name: [] for name in {pair[1] for sublist in sorted_dict.values() for pair in sublist}}
        for date_values in sorted_dict.values():
            for pair in date_values:
                sorted_data[pair[1]].append(pair[0])    
        
        for data_index, data_dict in enumerate(local_exams_data[module_key]['data']):
            local_exams_data[module_key]["data"][data_index]["data"] = sorted_data[data_dict["name"]]
        local_exams_data[module_key]["dates"] = sorted_dates
    local_courses_data['exams'] = local_exams_data
    return local_courses_data


def get_grade_data_dict_on_date(module_data, data_index):
    """
    Get a dictionary with dates as keys and grades as values for a specific module dictionary.
    """
    dates = module_data['dates']
    grade_data = module_data['data'][data_index]['data']
    result_dict = {date: grade for date, grade in zip(dates, grade_data)}
    return result_dict


def get_module_data_dict_on_date(module_data):
    """
    Get a dictionary with dates as keys and a list of tuples with grades and module names as values.
    """
    result_dict = {}
    grade_data = module_data['data']
    dates = module_data['dates']
    for local_date, values in zip(dates, zip(*[item["data"] for item in grade_data])):
        result_dict[local_date] = [(value, item["name"]) for item, value in zip(grade_data, values)]
    sorted_result_dict = dict(sorted(result_dict.items(), key=lambda x: x[0]))
    return sorted_result_dict


def internal_get_course_api_call(course_code):
    # API endpoint URL
    external_api_url = f"http://127.0.0.1:8000/data_pipeline/get_course_stats/{course_code}"
    # Send a GET request to the API endpoint
    response = requests.get(external_api_url)
    # Check if the request was successful
    if response.status_code == 200:
        print("Success!")
    else:
        print(f"Failed to retrieve data from API. Status code: {response.status_code}")

def fill_json_from_list(courses):
    """
    Simple script to fill the local JSON file with course data by making calls to own API.
    """
    for course in courses:
        internal_get_course_api_call(course.strip())
