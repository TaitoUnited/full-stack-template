from django.http import HttpResponse


def get_uptimez(request):
    return HttpResponse("UPTIME")
  
def get_healthz(request):
    return HttpResponse("HEALTH")