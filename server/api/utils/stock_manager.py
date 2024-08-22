
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
    Shows how functions need to be called, checked and passed for the algorithm to work when buying a stock.
    """
    portfolio = Portfolio.objects.filter(user=user).first()
    if not portfolio:
        portfolio = Portfolio.objects.create(user=user)

    new_price, new_base, buy_value = chained_calculate_price(course.base_price, amount, True)
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


def place_sell_order(user, stock, amount):
    """
    Shows how functions need to be called, checked and passed for the algorithm to work when selling a stock.
    """
    #print("Finalizing sell order!")

    if stock.amount >= amount:
        new_price, new_base, sell_value = chained_calculate_price(stock.course.base_price, amount, False)
        user.balance += sell_value
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
        new_price = calculate_price(new_base)
        course.price = new_price
    course.base_price = new_base
    course.price = new_price
    # course.daily_change = calculate_daily_course_price_change(course) # Should update daily change here
    course.save()
    # save_price_point(course) # After updating the course, you should save a new price point here. 


def chained_calculate_price(base_price, amount, is_buying=True):
    """
    Called when a user buys/sells a stock, correctly handles the amount so that the user may buy in stock.
    """
    print(f'current base price: {base_price}')
    constants = {}
    algorithm_constants_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../client/src/algorithm_constants.json'))
    with open(algorithm_constants_path) as f:
        constants = json.load(f)
    K = constants['K']
    A = constants['ALPHA']
    S = constants['SCALE']

    # Create an array of prices decrementing from base_price
    base_prices = np.array(0)
    
    if is_buying:
        base_prices = np.arange(base_price, base_price + (amount), 1)
    else:
        base_price -= 1 # Offset needed for correct behavior
        base_prices = np.arange(base_price, base_price - (amount), -1)
        
    # Compute all iteration prices at once using vectorized operations
    iteration_prices = price_algorithm(base_prices, K, A, S)
    
    # Sum iteration prices for the total trade value
    total_trade_value = np.sum(iteration_prices)
    new_price = iteration_prices[-1]
    new_base = base_prices[-1]

    if is_buying:
        new_base += 1 # Offset needed for correct behavior

    return new_price, new_base, total_trade_value


def calculate_price(base_price):
    """
    Use this when only making a single call to the price algorithm.
    """
    constants = {}
    algorithm_constants_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../client/src/algorithm_constants.json'))
    with open(algorithm_constants_path) as f:
        constants = json.load(f)
    K = constants['K']
    A = constants['ALPHA']
    S = constants['SCALE']

    return price_algorithm(base_price, K, A, S)


def price_algorithm(base_price, k, alpha, scale):
    """
    Algorithm for calculating the price of a stock from its "hidden" base price!

    k - controls upper limit of which the price will converge toward e.g. how high the graph will be
    alpha - controls the price change behavior e.g. the shape of the graph, should be above 1
    scale - simply scales the algorithm value

    The +1 at the start is just a precaution.

    Check out this desmos link for a better understanding of the algorithm/graph:
    https://www.desmos.com/calculator/xbcabfej38

    Note: Constants may not match those in algorithm_constants.json but the shape is the same,
          provided A (alpha) is greater than 1
    """
    return 1 + ((base_price**alpha) * (k - (k/base_price))) * (1/base_price) * scale



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