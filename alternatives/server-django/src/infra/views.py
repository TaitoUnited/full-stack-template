from django.http import HttpResponse
from django.db import connection
from ..app.config import Config


def get_config(request):
    client_config = {
        "APP_VERSION": Config.APP_VERSION,
    }
    return HttpResponse({"data": client_config})


def get_uptimez(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
    return HttpResponse({"status": "OK"})


def get_healthz(request):
    return HttpResponse({"status": "OK"})
