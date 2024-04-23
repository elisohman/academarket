from django.db import models
# Create your models here.

class User(models.Model):
    class Meta:
        db_table = 'users'  # Set the table name to 'user'

    username = models.CharField(max_length=30)
    email = models.CharField(max_length=30)
    password = models.CharField(max_length=30)
    coins = models.IntegerField(null=True)
