
from api.models import Portfolio, Stock
import numpy as np
import os
import json

def place_buy_order_example(user, course, amount):
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


def place_sell_order_example(user, stock, amount):
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

