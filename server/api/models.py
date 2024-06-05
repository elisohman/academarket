from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.


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


class Portfolio(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='portfolios')
    courses = models.ManyToManyField(Course, related_name='portfolios')


class Transaction(models.Model):
    class Meta:
        db_table = 'transactions' # Set the table name to 'transactions'
    id = models.AutoField(primary_key=True)
    amount = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='transactions')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='transactions')


