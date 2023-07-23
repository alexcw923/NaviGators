from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views import View
from src.place_search import NearbySearch
import json
# Create your views here.
def index(request):
    return render(request, 'index.html')

def place_search(request):
    latitude = float(request.GET.get("latitude", -118.700549))
    longitude = float(request.GET.get("longitude", 34.140505))
    category = request.GET.get("category", "food")
    search_radius = int(request.GET.get("search_radius", 25))
    max_locations = int(request.GET.get("max_locations", 25))

    location = [latitude, longitude]
    nearby_search = NearbySearch(location)

    places_result = nearby_search.search_places(category, search_radius, max_locations)
    print("PLACES RESULT:")
    print(places_result)
    return JsonResponse(json.loads(places_result), safe=False)


