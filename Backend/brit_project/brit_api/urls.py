from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/brit/', views.brit_response, name='brit_response'),
]