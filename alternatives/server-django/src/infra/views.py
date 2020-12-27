from django.http import HttpResponse
from src import db

def get_uptimez(request):
    db.execute('SELECT 1')
    return HttpResponse({'status': 'OK'})
  
def get_healthz(request):
    return HttpResponse({'status': 'OK'})