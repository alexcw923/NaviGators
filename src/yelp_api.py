# This is needed to perform REST API calls
import requests


API_KEY= "_829jRFE-rDYfhT7meqIGis35pqakWCiWPiy2ne2jec7Y4Mzp1uds_jaj_azA9yLyzVkKKpzyu6FUzXeyb2ItXCaXblyZf-E_F-1te-8vlnW5jH7yc6wv7FMyh68ZHYx" 

def get_business_details(term, latitude, longitude):
    """ Calls the Yelp API for Business Search

    Args:
        term (str): A word describing a category of businesses or a business name
        latitude (str): latitude of business
        longitude (str): longitude of business
    Returns:
        business_details (dict): dictionary of the matching business' attributes
    """
    # Busines search end point
    url = 'https://api.yelp.com/v3/businesses/search'
    # Header should contain the API key
    headers = {'Authorization': 'Bearer {}'.format(API_KEY)}
    # Search parameters
    url_params = {
        'term': term, # can be a category or name of business
        'latitude': float(latitude),
        'longitude': float(longitude),
        'limit': 1
        }

    # Call the API
    response = requests.request('GET', url, headers=headers, params=url_params)

    # To get a better understanding of the structure of 
    # the returned JSON object refer to the documentation
    # For each business, print the listed details
    business_details = {}
    for business in response.json()["businesses"]:
        business_details["name"] = business["name"]
        business_details["rating"] =  business["rating"]
        business_details["location"]["display_address"][0] =  business["location"]["display_address"][0] 
        business_details["url"] = business["url"]
        business_details["image_url"] = business["image_url"]
        business_details["price"] = business["price"]
        business_details["distance"] = business["distance"]

    return business_details


