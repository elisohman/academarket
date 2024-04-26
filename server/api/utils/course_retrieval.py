import requests
from bs4 import BeautifulSoup

def retrieve_data(url):
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

def save_course_list(data_list):
    with open('/Users/jackkolm/Documents/TDDD27/tddd27_2024_academarket/server/api/utils/data.txt', 'w') as file:
        for item in data_list:
            file.write(f"{item}\n")



def load_course_list():
    with open('/Users/jackkolm/Documents/TDDD27/tddd27_2024_academarket/server/api/utils/data.txt', 'r') as file:
        data_list = file.readlines()
    # Note: An extra character is somehow added to every element in the list
    return data_list

def merge_two_lists(list1, list2):
    unique_items = list(set(list1))
    # Add items from list2 to unique_items while skipping duplicates
    unique_items.extend(item for item in list2 if item not in unique_items)
    return unique_items



def retrieve_new_data_from_liu():
    urls = ["https://liu.se/en/article/exchange-courses?faculty=1",
            "https://liu.se/en/article/exchange-courses?faculty=2",
            "https://liu.se/en/article/exchange-courses?faculty=3",
            "https://liu.se/en/article/exchange-courses?faculty=4"]
    local_list = load_course_list()
    for url in urls:
        new_data_list = retrieve_data(url)
        local_list = merge_two_lists(local_list, new_data_list)
    return local_list

if __name__ == "__main__":
    data_list = retrieve_new_data_from_liu()
    # Save data_list to a local file
    save_course_list(data_list)
    print("Data retrieved and saved to file.")