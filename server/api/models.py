from django.contrib.auth.models import AbstractUser
from django.db import models
import datetime
from django.utils import timezone
class User(AbstractUser):
    balance = models.IntegerField(null=True, default=10000)
    courses = models.ManyToManyField('Course', related_name='users')


class Course(models.Model):
    class Meta:
        db_table = 'courses'  # Set the table name to 'courses'
    id = models.AutoField(primary_key=True)
    course_code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100, null=True) # accepts null but shouldn't be possible
    price = models.IntegerField(null=True)


class PricePoint(models.Model):
    id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='price_points')
    price = models.IntegerField()
    # date = models.DateTimeField(auto_now_add=True) #
    date = models.DateTimeField(default=timezone.now)
    timestamp = models.IntegerField()


class Stock(models.Model):
    id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='stocks')
    amount = models.IntegerField()
    
class Order(models.Model):
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
    
