
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
    new_price, new_base, buy_value, diff_value = calculate_course_price_update(course.base_price, amount, True)

    if user.balance >= buy_value:

        user.balance -= buy_value
        user.save()
        apply_course_price_update(course, new_price, new_base)

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

def place_buy_order_alt(user, course, amount):
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
    if user.balance >= amount*course.price:
        user.balance -= amount*course.price
        user.save()
        new_price, new_base, buy_value, diff_value = calculate_course_price_update(course.base_price, amount, True)
        apply_course_price_update(course, new_price, new_base)

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
        new_price, new_base, sell_value, diff_value = calculate_course_price_update(stock.course.base_price, amount, False)
        user.balance += sell_value
        user.save()
        apply_course_price_update(stock.course, new_price, new_base)
        stock.amount -= amount
        stock.save()
        if stock.amount == 0:
            stock.delete()
        return True
    return False


def place_sell_order_alternative(user, stock, amount):
    """
    Note: Currently not implemented.
    For the other potential solution described in place_sell_order_alt(). 
    Finalizes sell order for a given amount of a stock for a user.
    """
    #print("Finalizing sell order!")

    if stock.amount >= amount:
        new_price, new_base, sell_value, diff_value = calculate_course_price_update(stock.course.base_price, amount, False)
        user.balance += sell_value - diff_value
        user.save()
        apply_course_price_update(stock.course, new_price, new_base)
        stock.amount -= amount
        stock.save()
        if stock.amount == 0:
            stock.delete()
        return True
    return False



def apply_course_price_update(course, new_price, new_base):
    if new_base < 1:
        new_base = 1 
        course.base_price = new_base
        new_price = price_update_algorithm_single_call(new_base)
        course.price = new_price
    course.base_price = new_base
    course.price = new_price
    new_daily_change = calculate_daily_course_price_change(course)
    course.daily_change = new_daily_change
    course.save()
    save_price_point(course)

def calculate_course_price_update(base_price, amount, is_buying=True):
    constants = {}
    algorithm_constants_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../client/src/algorithm_constants.json'))
    with open(algorithm_constants_path) as f:
        constants = json.load(f)

    # Create an array of prices decrementing from base_price
    base_prices = np.array(0)
    
    if is_buying:
        #base_price -= 1
        #if amount == 1:
        #    base_prices = np.array(base_price)
        #else:
        #my_base_price = base_price
        base_prices = np.arange(base_price, base_price + (amount), 1)
    else:
        base_price -= 1
        #if amount == 1:
        #    base_prices = np.array(base_price)
        #else:
        base_prices = np.arange(base_price, base_price - (amount), -1)
    
    print(base_prices)
    # Compute all iteration prices at once using vectorized operations
    iteration_prices = price_update_algorithm(base_prices, constants)
    print(iteration_prices)
    # Compute the original price and calculate the difference and average difference value
    original_price = price_update_algorithm(base_price, constants)
    diff_value = np.sum(original_price - iteration_prices)

    total_trade_value = np.sum(iteration_prices)
    new_price, new_base = 0, 0
    #if amount > 1:
    new_price = iteration_prices[-1]
    new_base = base_prices[-1]
    #else:
    #    new_price = iteration_prices
    #    new_base = base_prices
    print(total_trade_value)
    return new_price, new_base, total_trade_value, abs(diff_value)

def price_update_algorithm_single_call(base_price):
    constants = {}
    algorithm_constants_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../client/src/algorithm_constants.json'))
    with open(algorithm_constants_path) as f:
        constants = json.load(f)
    return price_update_algorithm(base_price, constants)

def price_update_algorithm(base_price, constants):
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
        new_price_point = PricePoint.objects.create(course=course, price=course.price, timestamp=target_time_timestamp)
        return new_price_point # Server crashed when it returned 0