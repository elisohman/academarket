@echo off
call .venv\Scripts\activate
REM Run makemigrations
echo Running makemigrations...
python manage.py makemigrations

REM Run migrate
echo Running migrate...
python manage.py migrate

echo Migration completed.
pause
