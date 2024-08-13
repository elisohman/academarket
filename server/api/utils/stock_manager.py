
from api.models import Portfolio, Stock, PricePoint, BalancePoint
import math
from datetime import datetime
import numpy as np
import os
import json

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
    old_base = course.base_price
    new_price, new_base = 0, 0
    if is_buying:
        new_base = old_base + (1 * amount)
    else:
        new_base = old_base - (1 * amount)
    if new_base < 1:
        new_base = 1 
    course.base_price = new_base
    new_price = the_algorithm(new_base)
    new_daily_change = calculate_daily_course_price_change(course)
    course.daily_change = new_daily_change
    course.price = new_price
    course.save()
    save_price_point(course)

def the_algorithm(base_price):
    algorithm_constants_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../client/src/algorithm_constants.json'))
    with open(algorithm_constants_path) as f:
        constants = json.load(f)
    K = constants['K']
    A = constants['ALPHA']
    S = constants['SCALE']

    return 1 + ((base_price**A) * (K - (K/base_price)))*S*(1/base_price)


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


def calculate_daily_course_price_change(course):
    price_points = reversed(PricePoint.objects.filter(course=course).order_by('-timestamp'))
    price_points_on_date = list({(datetime.fromtimestamp(point.timestamp).date()): point for point in price_points}.values())
    if(len(price_points_on_date) >= 2):
        latest_price = price_points_on_date[-1].price
        second_latest_price = price_points_on_date[-2].price
        change_percentage = ((latest_price - second_latest_price) / second_latest_price) * 100
        change_percentage = round(change_percentage, 2)
        return change_percentage
    return 0

def calculate_daily_balance_change(user):
    price_points = reversed(BalancePoint.objects.filter(user=user).order_by('-timestamp'))
    price_points_on_date = list({(datetime.fromtimestamp(point.timestamp).date()): point for point in price_points}.values())
    if(len(price_points_on_date) >= 2):
        latest_price = price_points_on_date[-1].price
        second_latest_price = price_points_on_date[-2].price
        change_percentage = ((latest_price - second_latest_price) / second_latest_price) * 100
        return round(change_percentage, 2)
    return 0