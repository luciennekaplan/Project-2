from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo

# Setup flask and Mongo
app = Flask(__name__)
mongo = PyMongo(app, uri="mongodb://localhost:27017/employmentDB")

print(mongo.db.list_collection_names())

@app.route("/data-analyst")
def dataAnalyst():
    return mongo.db.CleanDataAnalyst.find()

if __name__ == "__main__":
    app.run(debug=True)