from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
class User(AbstractUser):
    balance = models.FloatField(null=True, default=10000)
    courses = models.ManyToManyField('Course', related_name='users')

class BalancePoint(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='balance_points')
    balance = models.FloatField()
    timestamp = models.IntegerField()

class Course(models.Model):
    class Meta:
        db_table = 'courses'  # Set the table name to 'courses'
    id = models.AutoField(primary_key=True)
    course_code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100, null=True) # accepts null but shouldn't be possible
    price = models.FloatField(null=True)
    base_price = models.FloatField(null=True)
    daily_change = models.FloatField(null=True)

class PricePoint(models.Model):
    id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='price_points', db_index=True)
    price = models.FloatField()
    # date = models.DateTimeField(auto_now_add=True) #
    date = models.DateTimeField(default=timezone.now)
    timestamp = models.IntegerField(db_index=True)

    class Meta:
        ordering = ["-timestamp"]


class Stock(models.Model):
    id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='stocks')
    amount = models.IntegerField()

class Order(models.Model): # To be deleted
    id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='orders', null=True)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='orders', null=True)
    amount = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    date = models.DateTimeField(default=timezone.now)
    saved_value = models.IntegerField()
    is_buying = models.BooleanField(default=True)

class Portfolio(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='portfolios', unique=True)
    stocks = models.ManyToManyField(Stock, related_name='portfolios')
    

class Transaction(models.Model):
    class Meta:
        db_table = 'transactions' # Set the table name to 'transactions'
    id = models.AutoField(primary_key=True)
    amount = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='transactions')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='transactions')
    
