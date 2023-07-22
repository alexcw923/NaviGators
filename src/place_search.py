from arcgis.gis import GIS
from arcgis.geocoding import geocode
import json
class NearbySearch:
    def __init__(self, location: tuple(float, float)):
        self.location = location
        self.gis=GIS()
        
    def search_places(self, category, search_radius=25, max_locations=25):
        geocoded_features = geocode(
            address=None,
            location=self.location,
            category=category,
            out_fields="Place_addr, PlaceName",
            max_locations=max_locations,
            distance=search_radius,
            as_featureset=True,
        )
        return geocoded_features
    
    


if __name__ == '__main__':
    location=[-118.71511, 34.09042]
    category="Coffee shop"
    obj = NearbySearch(location)
    
    result = obj.search_places(location, category)
    # result = search_places(location, category).to_dict()
    # print(result.to_json())
    # As a DF:
    # geocoded_df = result.sdf
    
    # print(json.load(str(result)))
    print(type(result))
