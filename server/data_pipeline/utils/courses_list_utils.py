import os, datetime, shutil, requests
from bs4 import BeautifulSoup
  

DATA_PATH =  'course_data/courses_list.txt'
DATA_FOLDER_PATH = 'course_data'
DATA_BACKUP_PATH = 'course_data/courses_backups'

def save_course_list(data_list):
    """
    Saves the course list to local text file and backs up previous iteration.
    """
    # Create backup folder if it doesn't exist
    os.makedirs(DATA_BACKUP_PATH, exist_ok=True)

    # Create backup file name with date and time
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    backup_file = f"{DATA_BACKUP_PATH}/courses_list_{timestamp}.txt"

    # Copy current courses_list.txt to backup file
    shutil.copyfile(DATA_PATH, backup_file)

    with open(DATA_PATH, 'w') as file:
        for item in data_list:
            file.write(f"{item}\n")

def load_course_list():
    """
    Loads the course list from local text file.
    """
    # Ensure the directory exists
    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
    
    # Ensure the file exists
    if not os.path.exists(DATA_PATH):
        with open(DATA_PATH, 'w') as file:
            pass  # Just create the file, no need to write anything
    
    # Read the file contents
    with open(DATA_PATH, 'r') as file:
        data_list = file.readlines()
    
    return data_list


def merge_two_lists(list1, list2):
    """
    Helper function to merge two lists while skipping duplicates.
    """
    unique_items = list(set(list1))
    # Add items from list2 to unique_items while skipping duplicates
    unique_items.extend(item for item in list2 if item not in unique_items)
    return unique_items

def retrieve_data(url):
    """
    Script for retrieving course codes from a certain LIU webpage.
    """
    # URL of the website
    # Send a GET request to the URL
    response = requests.get(url)
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content of the webpage
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find the tbody with class "period-body"
        tbody = soup.find('tbody', class_='period-body')
        
        if tbody:
            # Extract data from tbody
            rows = tbody.find_all('tr')
            
            # Create a list to store the extracted data
            data_list = []
            
            for row in rows:
                # Extract data from each row
                cells = row.find_all('td')
                for cell in cells:
                    a = cell.find('a')
                    html_string = str(a)
                    if html_string != "None":
                        soup2 = BeautifulSoup(html_string, 'html.parser')
                        # Extract the text content
                        trimmed_string = soup2.get_text(strip=True)
                        course_code = trimmed_string.split()[0]
                        data_list.append(course_code)
            return data_list
        else:
            print("tbody with class 'period-body' not found.")
    else:
        print(f"Failed to retrieve the webpage. Status code: {response.status_code}")


def retrieve_new_data_from_liu():
    """
    Script for retrieving course codes from LIU's webpages seen in the list below.
    """
    urls = ["https://liu.se/en/article/exchange-courses?faculty=1",
            "https://liu.se/en/article/exchange-courses?faculty=2",
            "https://liu.se/en/article/exchange-courses?faculty=3",
            "https://liu.se/en/article/exchange-courses?faculty=4"]
    local_list = load_course_list()
    for url in urls:
        new_data_list = retrieve_data(url)
        local_list = merge_two_lists(local_list, new_data_list)
    return local_list