from django.urls import path
from . import views

urlpatterns = [
    path('', views.posts, name='posts'),
    path('<str:id>', views.post, name='post'),
]