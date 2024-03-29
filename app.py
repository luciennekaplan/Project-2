from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo


# Setup flask and Mongo
app = Flask(__name__)
mongo = PyMongo(app, uri="mongodb://localhost:27017/employmentDB")

def getData(data, output):
    for row in data:
        output.append({
            "title": row["title"],
            "salaryHigh": row["salaryHigh"],
            "salaryLow": row["salaryLow"],
            "description": row["description"],
            "rating": row["rating"],
            "company": row["company"],
            "location": row["location"],
            "hq": row["hq"],
            "size": row["size"],
            "founded": row["founded"],
            "type": row["type"],
            "industry": row["industry"],
            "sector": row["sector"],
            "revenue": row["revenue"],
            "competitors": row["competitors"],
            "easy": row["easy"]
        })
    return output

@app.route("/")
def index():
    collections = mongo.db.collection_names()
    output = []
    for table in collections:
        data = mongo.db.get_collection(table).find()
        if (table[-9:] != "Locations"):
            output = getData(data, output)
    
    return render_template('index.html')


@app.route("/data-analyst")
def dataAnalyst():
    data = mongo.db.CleanDataAnalyst.find()
    output = getData(data,[])
    
    return jsonify({'result':output})

@app.route("/business-analyst")
def bizAnalyst():
    data = mongo.db.CleanBusinessAnalyst.find()
    output = getData(data,[])
    
    return jsonify({'result':output})

@app.route("/all")
def all():
    collections = mongo.db.collection_names()
    output = {}
    for table in collections:
        data = mongo.db.get_collection(table).find()
        if (table[-9:] != "Locations"):
            output[table] = getData(data,[])

    return jsonify(output)

@app.route("/data-analyst/locations")
def dataLocations():
    data = mongo.db.CleanDataAnalystLocations.find()
    output = {}
    for row in data:
        for key,value in row.items():
            if (key != '_id'):
                output[key]=value
    return jsonify(output)

@app.route("/business-analyst/locations")
def bizLocations():
    data = mongo.db.CleanBusinessAnalystLocations.find()
    output = {}
    for row in data:
        for key,value in row.items():
            if (key != '_id'):
                output[key]=value
    return jsonify(output)

if __name__ == "__main__":
    app.run(debug=True)
