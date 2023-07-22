from arcgis.gis import GIS
from arcgis.geocoding import geocode
import json, requests

class NearbySearch:
    def __init__(self, location: tuple()) -> None:
        self.location = location
        self.gis=GIS()
        
    def search_places(self, category, search_radius=25, max_locations=25) -> dict():
        """
            Search for places near the given category within the search_radius and return numbers of locations.
        Returns:
            Json object: list of dictionary with "PlaceName", "Address", "Coordinates" keys. Contains 
                         the name of the place, address and coordinates of the place.
        """
        try:
            geocoded_features = geocode(
                address=None,
                location=self.location,
                category=category
                ,
                out_fields="Place_addr, PlaceName",
                max_locations=max_locations,
                distance=search_radius,
                as_featureset=True,
            )
            return json.dumps([{"PlaceName": row["PlaceName"], "Address": row['Place_addr'], "Coordinates": {"x":row["SHAPE"]["x"],"y":row["SHAPE"]["y"]}}  
                for _, row in geocoded_features.sdf.iterrows()])
        except:
            # Should display "no result found" if return list is empty
            return json.dumps([])

    
    


if __name__ == '__main__':
    location=[-118.700549, 34.140505]
    category1="adfsadf"
    category2="hospital"
    category3="restaurant"
    category4="education" # category level 2
    obj = NearbySearch(location)
    
    
    result1 = obj.search_places(category=f"{category2}, {category3}")
    result2 = obj.search_places(category2)
    result3 = obj.search_places(category3)
    result4 = obj.search_places(category4)
    print("result 1")
    print(result1)
    print("result 2")
    print(result2)
    print("result 3")
    print(result3)
    print("result 4")
    print(result4)