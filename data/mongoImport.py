import pymongo
import os
import csv
import glob

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
    with open(files) as csvfile:
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