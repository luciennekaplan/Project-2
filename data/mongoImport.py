import pymongo
import os
import csv
import glob
from config import API_KEY
import requests
import json

# Get a list of all CSVs
csvpaths = glob.glob(os.path.join(os.path.dirname(__file__),"*.csv"))
# Make the mongo connection
client = pymongo.MongoClient("mongodb://localhost:27017")
db = client.employmentDB

# Start with empty database
for col in db.list_collection_names():
    db.drop_collection(col)

# Function for grabbing the file name
def nameTheCollection(name):
    finalSlash = name.rfind('/')+1
    return name[finalSlash:-4]

# For each file in the directory
for files in csvpaths:
    # Make a new collection based on the filename
    collection = db.create_collection(nameTheCollection(files))
    with open(files, encoding="utf8") as csvfile:
        csvreader = csv.reader(csvfile, delimiter=',')
        # Skip over the header and print it
        csv_header = next(csvreader)
        print(csv_header)

        # Insert each row into the collection
        for row in csvreader:
            collection.insert_one(
                {
                    "title":row[0],
                    "salaryHigh":row[16],
                    "salaryLow":row[15],
                    "description":row[2],
                    "rating":row[3],
                    "company":row[4],
                    "location":row[5],
                    "hq":row[6],
                    "size":row[7],
                    "founded":row[8],
                    "type":row[9],
                    "industry":row[10],
                    "sector":row[11],
                    "revenue":row[12],
                    "competitors":row[13],
                    "easy":row[14]
                }
            )
    # Check rows imported matches CSV length
    print(f"Rows imported: {collection.count()}")
# Check the collections created
print(f"Created the following collections:\n {db.list_collection_names()}")

# Now, get the lat/longs we'll need
collections = db.list_collection_names()
for table in collections:
    data = db.get_collection(table).find()
    locationCollection = db.create_collection(f"{table}Locations")
    
    uniques = data.distinct("location")
    #uniques = ["Artesia, CA"]
    for address in uniques:
        a = address.replace(" ","")
        params = {"address": a, "key": API_KEY}

        #Build URL using the Google Maps API
        base_url = "https://maps.googleapis.com/maps/api/geocode/json"

        try:
            # Run request
            response = requests.get(base_url, params=params).json()

            # Extract lat/lng
            lat = response["results"][0]["geometry"]["location"]["lat"]
            lng = response["results"][0]["geometry"]["location"]["lng"]

            locationCollection.insert_one({
                address: [lat, lng]
            })
        except:
            print(f"Coordinates of {address} not found")
    print(f"Rows imported: {locationCollection.count()}")

print(f"Created the following collections:\n {db.list_collection_names()}")
