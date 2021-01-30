import pymongo

# Make the mongo connection
client = pymongo.MongoClient("mongodb://localhost:27017")
db = client.employmentDB

db.data_analyst.insert_one(
    {
        "title":"Sr. Data Analyst",
        "salaryHigh":150000,
        "salaryLow":90000,
        "description":"Do the job",
        "rating":5.6,
        "company":"ACME Corp.",
        "location":"New York",
        "hq":"Portland",
        "size":"50 to 100",
        "founded":1981,
        "type":"Private",
        "industry":"IT",
        "sector":"Data",
        "revenue":"$2B to $5B",
        "competitors":"Coyote Corp",
        "easy":True
    }
)
