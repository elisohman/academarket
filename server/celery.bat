@echo off
REM Start venv
echo Activating server...
call .venv\Scripts\activate

REM Start server (accessible on devices across Wi-Fi!)
echo Starting server...
python manage.py runserver 0.0.0.0:8000