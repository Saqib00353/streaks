#!/bin/sh
set -e

if [ "$DATABASE" = "postgres" ]; then
  echo "Waiting for Postgres at $SQL_HOST:$SQL_PORT..."

  while ! nc -z "$SQL_HOST" "$SQL_PORT"; do
    sleep 0.5
  done

  echo "Postgres is up."
fi

python manage.py migrate --noinput
python manage.py collectstatic --noinput || true

if [ -n "$DJANGO_ADMIN_USERNAME" ] && [ -n "$DJANGO_ADMIN_EMAIL" ] && [ -n "$DJANGO_ADMIN_PASSWORD" ]; then
  echo "Ensuring superuser '$DJANGO_ADMIN_USERNAME' exists..."
  python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
username = '$DJANGO_ADMIN_USERNAME'
email = '$DJANGO_ADMIN_EMAIL'
password = '$DJANGO_ADMIN_PASSWORD'
if User.objects.filter(username=username).exists():
    print(f'Superuser \"{username}\" already exists, skipping.')
else:
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f'Superuser \"{username}\" created.')
"
else
  echo "Skipping superuser creation (DJANGO_ADMIN_USERNAME/EMAIL/PASSWORD not set)."
fi

exec "$@"