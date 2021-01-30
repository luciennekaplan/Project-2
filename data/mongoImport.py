import pymongo
import os
import csv
import glob

# Get a list of all CSVs
csvpaths = glob.glob(os.path.join(os.path.dirname(__file__),"*.csv"))
# Make the mongo connection
client = pymongo.MongoClient("mongodb://localhost:27017")
db = client.employmentDB

# Start with empty DB - CHANGE FOR EACH CSV
db.data_analyst.delete_many({})

# Begin import
for csv in csvpaths:
    with open(csv) as csvfile:
        csvreader = csv.reader(csvfile, delimiter=',')
        # Skip over the header and print it
        csv_header = next(csvreader)
        print(csv_header)

        for row in csvreader:
            # Insert into DB - CHANGE FOR EACH CSV
            db.data_analyst.insert_one(
                {
                    "title":row[1],
                    "salaryHigh":row[2],
                    "salaryLow":row[2],
                    "description":row[3],
                    "rating":row[4],
                    "company":row[5],
                    "location":row[6],
                    "hq":row[7],
                    "size":row[8],
                    "founded":row[9],
                    "type":row[10],
                    "industry":row[11],
                    "sector":row[12],
                    "revenue":row[13],
                    "competitors":row[14],
                    "easy":row[15]
                }
            )
    # Check rows imported matches CSV length
    print(f"Rows imported: {db.data_analyst.count()}")
