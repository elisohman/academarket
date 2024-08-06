
from api.models import Portfolio, Stock, PricePoint, BalancePoint
import math
from datetime import datetime
import numpy as np


def place_buy_order(user, course, amount):
    """
    Finalizes buy order and adds stock to user. 
    """
    portfolio = Portfolio.objects.filter(user=user).first()
    if not portfolio:
        portfolio = Portfolio.objects.create(user=user)
    if user.balance >= course.price * amount:
        
        user.balance -= course.price * amount
        user.save()
        existing_stock = portfolio.stocks.filter(course=course).first()
        if existing_stock:
            existing_stock.amount += amount
            existing_stock.save()
        else:
            new_stock = Stock.objects.create(course=course, amount=amount)
            portfolio.stocks.add(new_stock)
        portfolio.save()
        course_price_update(course, amount, True)

        return True
    return False


def place_sell_order(user, stock, amount):
    """
    Finalizes sell order for a given amount of a stock for a user.
    """
    #print("Finalizing sell order!")
    if stock.amount >= amount:
        course_price_update(stock.course, amount, False)
        user.balance += stock.course.price * amount
        user.save()
        stock.amount -= amount
        stock.save()
        if stock.amount == 0:
            stock.delete()
        return True
    return False

def course_price_update(course, amount, is_buying):
    course_price = course.price
    if course_price == 1:
        course_price = 2
    print(f'Course price: {course_price}, Log course price: {math.log(course_price)}, Amount: {amount}, Buy factor: {is_buying}')
    #new_price = (math.log(course_price))*amount*buy_factor + course_price
    #new_price = (math.(course_price))*amount*buy_factor + course_price
    k = 0.1
    new_price = 0
    if is_buying:
        new_price = course_price * (1+k*np.log(amount+1))
    else:
        new_price = course_price * (1/(1+k*np.log(amount+1)))
    if new_price <= 0.001:
        new_price = 0.001
    course.price = new_price
    course.save()
    save_price_point(course)

def save_price_point(course):
    price = course.price
    timestamp = datetime.now().timestamp()
    price_point = PricePoint(course=course, price=price, timestamp=timestamp)
    price_point.save()

def save_balance_point(user):
    balance = user.balance
    timestamp = datetime.now().timestamp()
    balance_point = BalancePoint(user=user, balance=balance, timestamp=timestamp)
    balance_point.save()


def get_last_24h_change(course):
    # This doesnt work correctly yet
    #price_points = PricePoint.objects.filter(course=course).order_by('-timestamp')
    price_points = PricePoint.objects.filter(course=course).order_by('-timestamp')
    timestamps = sorted([point.timestamp for point in price_points])
    unique_dates = {datetime.fromtimestamp(timestamp).date(): point.price for timestamp, point in zip(timestamps, price_points)}
    unique_dates = dict(sorted(unique_dates.items())[-2:])
    latest_price = list(unique_dates.values())[0]
    previous_price = list(unique_dates.values())[1]
    change_percentage = (latest_price - previous_price) / previous_price * 100
    print(change_percentage)
    print(unique_dates)
# APE 3964.830398684156
# APE 118338.90430853292
# APE 118113.90430853292
# APE 118136.49739805765
# APE 118136.49739805765
# APE 113062.49739805765
# APE 135721.64136886346
# APE 135601.64136886346
# APE 135721.64136886346