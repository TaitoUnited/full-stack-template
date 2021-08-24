from django.http import HttpResponse
from django.db import connection


def get_uptimez(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
    return HttpResponse({"status": "OK"})


def get_healthz(request):
    return HttpResponse({"status": "OK"})
