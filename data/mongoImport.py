import pymongo
import os
import csv

# Read in the csv - CHANGE THIS FOR EACH CSV
csvpath = os.path.join(os.path.dirname(__file__), "DataAnalyst.csv")
# Make the mongo connection
client = pymongo.MongoClient("mongodb://localhost:27017")
db = client.employmentDB

# Start with empty DB - CHANGE FOR EACH CSV
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
