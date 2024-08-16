
from api.models import Portfolio, Stock, PricePoint, BalancePoint
import math
from datetime import datetime, timedelta
from django.utils import timezone
import numpy as np
import os
import json

TRADE_VALUE = 250

def place_buy_order(user, course, amount):
    """
    Note: Currently not implemented.
    Another (potential) solution, made so that user may buy the course price value directly
    without incrementally counting the changes, by offsetting the difference when selling.
    I don't know 100% if this will work, but if it does it's a more intuitive solution.
    Finalizes buy order and adds stock to user. 
    """
    portfolio = Portfolio.objects.filter(user=user).first()
    if not portfolio:
        portfolio = Portfolio.objects.create(user=user)
    if user.balance >= amount*TRADE_VALUE:
        user.balance -= amount*TRADE_VALUE
        user.save()
        apply_course_price_update(course, amount)

        existing_stock = portfolio.stocks.filter(course=course).first()
        if existing_stock:
            existing_stock.amount += amount
            existing_stock.save()
        else:
            new_stock = Stock.objects.create(course=course, amount=amount)
            portfolio.stocks.add(new_stock)
        portfolio.save()

        return True
    return False


def place_sell_order(user, stock, amount):
    """
    Finalizes sell order for a given amount of a stock for a user.
    """
    #print("Finalizing sell order!")

    if stock.amount >= amount:
        user.balance += TRADE_VALUE*amount
        user.save()
        apply_course_price_update(stock.course, amount)
        stock.amount -= amount
        stock.save()
        if stock.amount == 0:
            stock.delete()
        return True
    return False



def apply_course_price_update(course, amount, is_buying=True):
    new_price = 0
    if is_buying:
        new_price = course.price + amount*TRADE_VALUE
    else:
        new_price = course.price - amount*TRADE_VALUE
    course.price = new_price
    new_daily_change = calculate_daily_course_price_change(course)
    new_daily_change_percent = calculate_daily_course_price_change(course, percent=True)
    course.daily_change = new_daily_change
    course.daily_change_percent = new_daily_change_percent
    print("New price: ", new_price)
    print("New daily change: ", new_daily_change)
    print("New daily change percent: ", new_daily_change_percent)
    course.save()
    save_price_point(course)


def get_course_price(course):
    return course.price

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


def calculate_daily_course_price_change(course, percent=False):
    current_price = course.price
    target_time = timezone.now() - timedelta(hours=24)
    yesterday_price = get_closest_price_at_time(course, target_time).price
    print("YESTERDAY_PRICE = ", yesterday_price)
    print("CURRENT_PRICE = ", current_price)
    if percent:
        change = ((current_price - yesterday_price) / yesterday_price) * 100
    else:
        change = current_price - yesterday_price
    return round(change, 2)


def calculate_daily_balance_change(user):
    price_points = reversed(BalancePoint.objects.filter(user=user).order_by('-timestamp'))
    price_points_on_date = list({(datetime.fromtimestamp(point.timestamp).date()): point for point in price_points}.values())
    if(len(price_points_on_date) >= 2):
        latest_price = price_points_on_date[-1].price
        second_latest_price = price_points_on_date[-2].price
        change_percentage = ((latest_price - second_latest_price) / second_latest_price) * 100
        return round(change_percentage, 2)
    return 0

def get_closest_price_at_time(course, target_time):
    target_time_timestamp = target_time.timestamp()
    price_point_before = PricePoint.objects.filter(course=course, timestamp__lte=target_time_timestamp).first()
    price_point_after = PricePoint.objects.filter(course=course, timestamp__gte=target_time_timestamp).last()
    if price_point_before and price_point_after:
        timestamp_before = price_point_before.timestamp
        timestamp_after = price_point_after.timestamp
        if (target_time_timestamp - timestamp_before) <= (timestamp_after - target_time_timestamp):
            return price_point_before
        else:
            return price_point_after
    elif price_point_before:
        return price_point_before
    elif price_point_after:
        return price_point_after
    else:
        new_price_point = PricePoint.objects.create(course=course, price=course.price, timestamp=target_time_timestamp)
        return new_price_point # Server crashed when it returned 0