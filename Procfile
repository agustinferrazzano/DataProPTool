web: cd backend && gunicorn backend.wsgi:application --host 0.0.0.0 --port $PORT
release: cd backend && python manage.py migrate && python manage.py collectstatic --noinput