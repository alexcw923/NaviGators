from arcgis.gis import GIS
from arcgis.geocoding import geocode
import json

def search_places(location, category, max_locations=25):
    gis = GIS()
    geocoded_features = geocode(
        address=None,
        location=location,
        category=category,
        out_fields="Place_addr, PlaceName",
        max_locations=max_locations,
        as_featureset=True,
    )
    return geocoded_features


if __name__ == '__main__':
    location=[-118.71511, 34.09042]
    category="Coffee shop"
    # result = json.loads(search_places(location, category)).to_json()
    result = search_places(location, category)
    # print(result.to_json())
    print(json.load(str(result)))
    print(result)
    print(0)