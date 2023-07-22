# This is needed to perform REST API calls
import requests
import json

import os
YELP_API_KEY=os.getenv('YELP_API_KEY') # Create .env file locally and populate it with the YELP_API_KEY value

def get_business_details(term, latitude, longitude):
    """ Calls the Yelp API for Business Search
    Args:
        term (str): A word describing a category of businesses or a business name
        latitude (float): latitude of business
        longitude (float): longitude of business
    Returns:
        business_details (dict): dictionary of the matching business' attributes
    """
    # Business search end point
    url = 'https://api.yelp.com/v3/businesses/search'

    # Header should contain the API key
    headers = {'Authorization': 'Bearer {}'.format(YELP_API_KEY)}
    # Search parameters
    url_params = {
        'term': term, # can be a category or name of business
        'latitude': latitude,
        'longitude': longitude,
        'limit': 1, # only return one matching value
        'sort_by': 'distance'
        }

    # Call the API
    try: 
        response = requests.request('GET', url, headers=headers, params=url_params)
        
        # Extract the listed details for the returned business
        business_details = {}
        business = response.json()["businesses"][0]

        business_details["name"] = business["name"]
        business_details["rating"] = business["rating"]
        location = business["location"]
        business_details["display_address"] = location["display_address"][0] + ", " + location["display_address"][1]
        business_details["url"] = business["url"]
        business_details["image_url"] = business["image_url"]
        business_details["price"] = business["price"]
        business_details["distance"] = business["distance"]
        
    except:
        return "No details found for this location"

    return json.dumps(business_details)


if __name__ == '__main__':
    print(get_business_details(term="food", latitude=34.059124965974696, longitude=-117.19600308488995))