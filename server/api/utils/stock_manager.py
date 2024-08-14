
from api.models import Portfolio, Stock, PricePoint, BalancePoint
import math
from datetime import datetime, timedelta
from django.utils import timezone
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
        buy_value = course_price_update(course, amount, True)

        user.balance -= buy_value #course.price * amount # Note: this behavior might be weird, check first comment if so
        user.save()
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
        sell_value = course_price_update(stock.course, amount, False)
        user.balance += sell_value
        user.save()
        stock.amount -= amount
        stock.save()
        if stock.amount == 0:
            stock.delete()
        return True
    return False

def course_price_update(course, amount, is_buying):
    old_base = course.base_price
    sell_value = 0
    if is_buying:
        sell_value = calculate_course_price_update(course, old_base, amount, True)
    else:
        sell_value = calculate_course_price_update(course, old_base, amount, False)
    if new_base < 1:
        new_base = 1 
        course.base_price = new_base
        new_price = the_algorithm(new_base)
        course.price = new_price
    save_price_point(course)
    new_daily_change = calculate_daily_course_price_change(course)
    course.daily_change = new_daily_change
    course.save()
    return sell_value
def calculate_course_price_update(course, base_price, amount, is_buying=True):
    base_prices = np.array(0)
    if is_buying:
        base_prices = np.arange(base_price, base_price + amount, 1)
    else:
        base_prices = np.arange(base_price, base_price - amount, -1)
    # Create an array of prices decrementing from base_price
    print(base_prices)
    
    # Compute the original price once
    original_price = the_algorithm(base_price)
    
    # Compute all iteration prices at once using vectorized operations
    iteration_prices = the_algorithm(base_prices)
    
    # Calculate the difference and average difference value
    diff_value = np.sum(original_price - iteration_prices)
    new_price = iteration_prices[-1]
    new_base = base_prices[-1]
    course.base_price = new_base
    course.price = new_price

    return abs(diff_value)


def the_algorithm(base_price, constants):
    K = constants['K']
    A = constants['ALPHA']
    S = constants['SCALE']

    return 1 + ((base_price**A) * (K - (K/base_price))) * S * (1/base_price)

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
    current_price = get_closest_price_at_time(course, timezone.now()).price
    target_time = target_time = timezone.now() - timedelta(hours=24)
    yesterday_price = get_closest_price_at_time(course, target_time).price
    print("YESTERDAY_PRICE = ", yesterday_price)
    print("CURRENT_PRICE = ", current_price)
    change_percentage = ((current_price - yesterday_price) / yesterday_price) * 100
    return round(change_percentage, 2)

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
        return 0