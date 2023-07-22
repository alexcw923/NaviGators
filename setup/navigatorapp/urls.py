from django.urls import path, include
from navigatorapp.views import SearchPlacesView
from . import views

urlpatterns = [
    path('', views.index, name='index'),
]

# urlpatterns = [
#     path('', views.index, name='index'),
# ]

