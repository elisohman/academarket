import os, datetime, shutil

def save_course_list(data_list):
    # Create backup folder if it doesn't exist
    backup_folder = '../courses_backups'
    os.makedirs(backup_folder, exist_ok=True)

    # Create backup file name with date and time
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = f"{backup_folder}/courses_list_{timestamp}.txt"

    # Copy current courses_list.txt to backup file
    shutil.copyfile('../courses_list.txt', backup_file)

    with open('../courses_list.txt', 'w') as file:
        for item in data_list:
            file.write(f"{item}\n")

def load_course_list():
    with open('../courses_list.txt', 'r') as file:
        data_list = file.readlines()
    # Note: An extra character is somehow added to every element in the list
    return data_list

def merge_two_lists(list1, list2):
    unique_items = list(set(list1))
    # Add items from list2 to unique_items while skipping duplicates
    unique_items.extend(item for item in list2 if item not in unique_items)
    return unique_items