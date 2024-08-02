from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from api.models import User, Course, PricePoint
import random
def start():
    scheduler = BackgroundScheduler()
    #scheduler.add_job(test_job, 'interval', seconds=10)
    scheduler.add_job(update_course_prices, 'interval', seconds=3.1)
    scheduler.add_job(trade_simulation, 'interval', seconds=3)

    scheduler.start()

def update_course_prices():
    print("Updating course prices...")
    courses = Course.objects.all()
    for course in courses:
        price = course.price
        price_point = PricePoint(course=course, price=price)
        price_point.save()

def trade_simulation():
    print("Trading...")
    course = Course.objects.filter(course_code="SNOP25").first()
    if not course:
        new_course = Course(course_code="SNOP25", name="Mandeltillverkning med Göran Östlund", price=100)
        new_course.save()
    else:
        course.price += random.randint(-10, 10)
        course.save()


def test_job():
    print("Vafan {}".format(datetime.now()))