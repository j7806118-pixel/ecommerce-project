"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views.
"""

from django.contrib import admin
from django.urls import path, include
from orders import views  # import home view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('orders.urls')),  # if you have api app
    path('', views.home),  # root URL
]