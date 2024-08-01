from celery import shared_task
from api.utils.price_history import save_current_price
@shared_task
def price_task():
    print("price task")
    #save_current_price()
    return 1