@echo off

REM Navigate to your Django project directory
cd "C:\path\to\your\django\project"

REM Run makemigrations
echo Running makemigrations...
python manage.py makemigrations

REM Run migrate
echo Running migrate...
python manage.py migrate

echo Migration completed.
pause
