#!/bin/bash

# Run makemigrations
echo "Running makemigrations..."
python manage.py makemigrations

# Run migrate
echo "Running migrate..."
python manage.py migrate

echo "Migration completed."