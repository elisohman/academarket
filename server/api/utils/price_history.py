from api.models import Course, PricePoint
# Jag har inte listat ut dehär än riktigt, men målet är att save_current_price ska köras för ett visst intervall
# (möjligtvis lite bättre optimerad hihi)
def save_current_price():
    print("we scheduling")
    for course in Course.objects.all():
        new_price_point = PricePoint(course=course, price = course.price)
        new_price_point.save()

def start_scheduler():
    print("Starting scheduler... (this code block is empty btw, so nothing is happening)")

