import json
from django.views import View
# from src.place_search import NearbySearch
from django.http import JsonResponse, HttpResponse
from django.template import loader
from django.shortcuts import render

def index(request):
    # template = loader.get_template('navigatorapp/templates/template.html')
    # template = loader.get_template('template.html')
    # return HttpResponse(template.render())
    return HttpResponse("<h1>Testing Output!</h1>")



# class SearchPlacesView(View):
#     def __init__(self):
#         self.nearest_search = None
#         self.x = None
#         self.y = None
        
#     def set_location(self, request):
#         self.x = float(request.GET.get('x'))
#         self.y = float(request.GET.get('y'))
        
#         # Instantiate the NearbySearch class with the location tuple
#         self.nearby_search = NearbySearch(location=(self.x, self.y))
        
#     def search_places(self, request):
#         category = request.GET.get('category', '')  
#         search_radius = int(request.GET.get('search_radius', 25)) 
#         max_locations = int(request.GET.get('max_locations', 25))
        
#         json_data = self.nearby_search.search_places(category, search_radius, max_locations)
#         return JsonResponse(json.loads(json_data), safe=False)

