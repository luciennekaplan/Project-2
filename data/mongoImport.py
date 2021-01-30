import pymongo
import os
import csv

# Read in the csv - CHANGE THIS FOR EACH CSV
csvpath = os.path.join(os.path.dirname(__file__), "BusinessAnalyst.csv")
# Make the mongo connection
client = pymongo.MongoClient("mongodb://localhost:27017")
db = client.employmentDB

# Start with empty - CHANGE FOR EACH CSV
db.data_analyst.delete_many({})

# Begin import
with open(csvpath) as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')
    # Skip over the header and print it
    csv_header = next(csvreader)
    print(csv_header)

    for row in csvreader:
        # Insert into DB - CHANGE FOR EACH CSV
        db.data_analyst.insert_one(
            {
                "title":row[2],
                "salaryHigh":row[2],
                "salaryLow":row[2],
                "description":row[2],
                "rating":row[2],
                "company":row[2],
                "location":row[2],
                "hq":row[2],
                "size":row[2],
                "founded":row[2],
                "type":row[2],
                "industry":row[2],
                "sector":row[2],
                "revenue":row[2],
                "competitors":row[2],
                "easy":row[2]
            }
        )


# dataAnalyst = db.data_analyst.find()
# for job in dataAnalyst:
#     print(job)
