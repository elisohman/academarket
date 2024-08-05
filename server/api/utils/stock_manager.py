
from api.models import Portfolio, Stock, Order, Course
import math

def place_buy_order(user, course, amount):
    """
    Places order of given amount of a stock for a user. Returns true if the player can afford it.
    """
    buy_value = course.price * amount
    if user.balance >= buy_value:
        new_order = Order.objects.create(course=course, amount=amount, user=user, saved_value=buy_value, is_buying=True)
        new_order.save()
        return True
    return False

def finalize_buy_order(user, course, amount):
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
        return True
    return False



def place_sell_order(user, stock, amount):
    """
    Sells a given amount of a stock for a user. Returns true if the player has enough stock to sell.
    """
    print(f'amount: {amount}, stock amount: {stock.amount}, stock name: {stock.course.course_code}')
    if stock.amount >= amount:
        sell_value = stock.course.price * amount
        new_order = Order.objects.create(course=stock.course, stock=stock, amount=amount, user=user, saved_value=sell_value, is_buying=False)
        new_order.save()
        return True
    return False

def finalize_sell_order(user, stock, amount):
    """
    Finalizes sell order for a given amount of a stock for a user.
    """
    #print("Finalizing sell order!")
    if stock.amount >= amount:
        user.balance += stock.course.price * amount
        user.save()
        stock.amount -= amount
        stock.save()
        if stock.amount == 0:
            stock.delete()
        return True
    return False


def finalize_orders():
    """
    Finalizes all orders in the database.
    """
    orders = Order.objects.all()
    if orders:
        all_orders = {}
        for order in orders:
            stock_key = order.course.course_code
            if stock_key not in all_orders:
                all_orders[stock_key] = []
            all_orders[stock_key].append(order)
        for key in all_orders:
            buy_volume = 0
            sell_volume = 0
            for order in all_orders[key]:
                course = Course.objects.filter(course_code=key).first()
                if order.is_buying:
                    buy_volume += order.amount
                    if finalize_buy_order(order.user, order.course, order.amount):
                        order.delete()
                else:
                    sell_volume += order.amount
                    if finalize_sell_order(order.user, order.stock, order.amount):
                        order.delete()

            change_factor = 1.0
            volume_diff = buy_volume - sell_volume
            if volume_diff > 0:
                change_factor = 1.1
            elif volume_diff < 0:
                change_factor = 0.9
            else:
                change_factor = 1.0
            new_course_value = int(math.ceil(course.price * change_factor))
            if new_course_value < 1:
                new_course_value = 1
            course.price = new_course_value
            course.save()
