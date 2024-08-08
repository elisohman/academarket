from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from api.models import User, Course, PricePoint, Portfolio, Stock, BalancePoint
import api.utils.bot_utils as bot_utils
import random
import api.utils.stock_manager as stock_manager

def start():
    scheduler = BackgroundScheduler()
    #scheduler.add_job(test_job, 'interval', seconds=10)
    scheduler.add_job(timestamp_course_prices, 'interval', minutes=1)
    scheduler.add_job(trade_simulation, 'interval', seconds=5)
    scheduler.add_job(timestamp_user_balance, 'interval', minutes=1)
    scheduler.start()

def timestamp_user_balance():
    print("Updating user balances...")
    users = User.objects.all()
    for user in users:
        timestamp = datetime.now().timestamp()
        user_balance = user.balance
        user_balance_point = BalancePoint(user=user, balance=user_balance, timestamp=timestamp)
        user_balance_point.save()

def timestamp_course_prices():
    #print("Updating course prices...")
    courses = Course.objects.all()
    for course in courses:
        stock_manager.save_price_point(course)

def trade_simulation():
    print("Bots are trading...")
    bot_names = bot_utils.get_bot_names()
    for i in range(20):
        name = bot_names[random.randint(0, len(bot_names)-1)].rstrip('\n')
        user = User.objects.filter(username=name).first()
        if user:
            chance = random.randint(1, 100)
            #stock_manager.buy_stock(user, random_stock.course, random.randint(1, 10))
            if chance <= 45:
                stocks = Portfolio.objects.filter(user=user).first().stocks.all()
                if stocks:
                    random_stock = stocks[random.randint(0, len(stocks)-1)]
                    sell_amount = random_stock.amount
                    print(f'Sell amount : {sell_amount}')
                    if random_stock.amount > 1:
                        sell_amount = random.randint(1, random_stock.amount)
                    if sell_amount == 0:
                        random_stock.delete()
                        continue
                    stock_manager.place_sell_order(user, random_stock, sell_amount)
            else:
                courses = Course.objects.all()
                random_course = courses[random.randint(1, len(courses)-1)]
                max_buy_amount = random_course.price // user.balance
                if max_buy_amount > 1:
                    buy_amount = random.randint(1, max_buy_amount)
                    stock_manager.place_buy_order(user, random_course, buy_amount)
                elif max_buy_amount == 1:
                    stock_manager.place_buy_order(user, random_course, 1)



def test_job():
    print("Vafan {}".format(datetime.now()))