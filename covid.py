from contextlib import nullcontext
from flask import Blueprint, jsonify  # jsonify creates an endpoint response object
from flask_restful import Api, Resource # used for REST API building
import requests  # used for testing 
import time
# Blueprints enable python code to be organized in multiple files and directories https://flask.palletsprojects.com/en/2.2.x/blueprints/
covid_api = Blueprint('covid_api', __name__,
                   url_prefix='/api/covid')

# API generator https://flask-restful.readthedocs.io/en/latest/api.html#id1
api = Api(covid_api)

"""Time Keeper
Returns:
    Boolean: is it time to update?
"""
def updateTime():
    global last_run  # the last_run global is preserved between calls to function
    try: last_run
    except: last_run = None
    
    # initialize last_run data
    if last_run is None:
        last_run = time.time()
        return True
    
    # calculate time since last update
    elapsed = time.time() - last_run
    if elapsed > 86400:  # update every 24 hours
        last_run = time.time()
        return True
    
    return False

"""API Handler
Returns:
    String: API response
"""   
def getCovidAPI():
    global covid_data  # the covid_data global is preserved between calls to function
    try: covid_data
    except: covid_data = None

    """
    Preserve Service usage / speed time with a Reasonable refresh delay
    """
    if updateTime(): # request Covid data
        """
        RapidAPI is the world's largest API Marketplace. 
        Developers use Rapid API to discover and connect to thousands of APIs. 
        """
        url = "https://corona-virus-world-and-india-data.p.rapidapi.com/api"
        headers = {
            'x-rapidapi-key': "dec069b877msh0d9d0827664078cp1a18fajsn2afac35ae063",
            'x-rapidapi-host': "corona-virus-world-and-india-data.p.rapidapi.com"
        }
        response = requests.request("GET", url, headers=headers)
        covid_data = response
    else:  # Request Covid Data
        response = covid_data

    return response