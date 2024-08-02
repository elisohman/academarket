from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(ilovePython, 'interval', minutes=1)
    scheduler.start()


def ilovePython():
    print("I love python {}".format(datetime.now()))