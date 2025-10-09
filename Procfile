web: gunicorn wsgi:application --host 0.0.0.0 --port $PORT
release: python manage.py migrate && python manage.py collectstatic --noinput