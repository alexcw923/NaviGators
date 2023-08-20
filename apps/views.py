from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views import View
import json
from arcgis.gis import GIS
from arcgis.geocoding import geocode

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
    gis = GIS()
    try:
        geocoded_features = geocode(
            address=None,
            location=location,
            category=category,
            out_fields="Place_addr, PlaceName",
            max_locations=max_locations,
            distance=search_radius,
            as_featureset=True,
        )
        print("calculating")
        return JsonResponse([{"PlaceName": row["PlaceName"], "Address": row['Place_addr'], "Coordinates": {"x":row["SHAPE"]["x"],"y":row["SHAPE"]["y"]}}  
            for _, row in geocoded_features.sdf.iterrows()], safe=False)
    except Exception as e:
        # Should display "no result found" if return list is empty 
        return JsonResponse([str(e)], safe = False)

    
    # places_result = nearby_search.search_places(category, search_radius, max_locations)
    # print("PLACES RESULT:")
    # print(places_result)
    # return JsonResponse(json.loads(places_result), safe=False)


