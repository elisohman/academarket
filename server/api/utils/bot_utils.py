from api.models import User, Portfolio, Course, Stock
import random

def create_bot_user_in_db(name: str, email: str) -> bool:
    """
    Create a bot user for the database.
    """
    if not User.objects.filter(username=name).exists():
        bot_user = User.objects.create(username=name, email=email)
        bot_user.set_password("supersecretbotpassword")
        bot_user.save()
        new_portfolio = Portfolio(user=bot_user)
        new_portfolio.save()
        return True
    return False

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
    if create_bot_user_in_db("Jamal Davis", "jamaldavis@daviscompany.com"):
        add_bot_name_to_txt("Jamal Davis")
    for i in range(100):
        first_name = firstnames[random.randint(0, len(firstnames)-1)].strip()
        surname = surnames[random.randint(0, len(surnames)-1)].strip()
        full_name = first_name + " " + surname
        email = first_name + surname + "@botmail.com"
        #print(name)
        success = create_bot_user_in_db(full_name, email)
        if success:
            add_bot_name_to_txt(full_name)

def create_bots_from_list() -> None:
    """
    Create bots from name list without creating any new names.
    """
    bot_names = get_bot_names()
    for bot_name in bot_names:
        bot_name = bot_name.strip()
        bot_user = User.objects.filter(username=bot_name).first()
        bot_name_without_space_lowercase = bot_name.replace(" ", "").lower()
        create_bot_user_in_db(bot_name, bot_name_without_space_lowercase + "@botmail.com")

def get_bot_names() -> list:
    """
    Get the names of all bots from the botnames.txt file in resources/
    """
    with open('api/utils/resources/botnames.txt', 'r') as f:
        bot_names = f.readlines()
    return bot_names

def setup_bot_portfolio(bot_user: User) -> None:
    """
    Setup the portfolio for a bot user.
    """
    bot_portfolio = Portfolio.objects.filter(user=bot_user).first()
    courses = Course.objects.all()
    for i in range(10):
        course = courses[random.randint(0, len(courses)-1)]
        amount = random.randint(1, 15)
        existing_stock = bot_portfolio.stocks.filter(course=course).first()

        if existing_stock:
            print(f'Bot {bot_user.username} already owns stock {course.course_code}.')
            continue
        else:
            new_stock = Stock.objects.create(course=course, amount=amount)
            bot_portfolio.stocks.add(new_stock)
            print(f'Adding stock {course.course_code} to bot {bot_user.username}.')

    bot_user.balance = random.randint(5000, 30000)
    if bot_user.username == "Jamal Davis":
        bot_user.balance = 50000
    bot_user.save()
    bot_portfolio.save()

def delete_bots() -> None:
    """
    Delete all bots from the database.
    """
    bot_names = get_bot_names()
    for bot_name in bot_names:
        bot_name = bot_name.strip()
        bot_user = User.objects.filter(username=bot_name).first()
        if bot_user:
            bot_user.delete()
            print(f"Deleted bot {bot_name}")

def setup_bot_economy() -> None:
    """
    Setup the economy for all bots.
    """
    bot_names = get_bot_names()
    for bot_name in bot_names:
        bot_name = bot_name.strip()
        bot_user = User.objects.filter(username=bot_name).first()
        setup_bot_portfolio(bot_user)
        print(f"Setup economy for {bot_name}")