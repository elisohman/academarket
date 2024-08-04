from api.models import User, Portfolio
import random

def create_bot_user_in_db(name: str, email: str) -> None:
    """
    Create a bot user for the database.
    """
    if not User.objects.filter(username=name).exists():
        bot_user = User.objects.create(username=name, email=email, password='supersecretbotpassword')
        bot_user.save()
        new_portfolio = Portfolio(user=bot_user)
        new_portfolio.save()

def add_bot_name_to_txt(name: str) -> None:
    """
    Add the newly created bot's name to the botnames.txt file in resources/
    """
    with open('api/utils/resources/botnames.txt', 'a') as f:
        f.write(name + "\n")
    

def get_names_from_files() -> tuple:
    """
    Get a list of names from the firstnames.txt and surnames.txt files in resources/
    """
    with open('api/utils/resources/firstnames.txt', 'r') as f:
        firstnames = f.readlines()
    with open('api/utils/resources/surnames.txt', 'r') as f:
        surnames = f.readlines()

    return firstnames, surnames

def create_bots() -> None:
    firstnames, surnames = get_names_from_files()
    # Get a random first and a random surname and concatenate them
    create_bot_user_in_db("Jamal Davis", "jamaldavis@daviscompany.com")
    for i in range(100):
        first_name = firstnames[random.randint(0, len(firstnames)-1)].strip()
        surname = surnames[random.randint(0, len(surnames)-1)].strip()
        full_name = first_name + " " + surname
        email = first_name + surname + "@botmail.com"
        #print(name)
        create_bot_user_in_db(full_name, email)

