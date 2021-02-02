from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo

# Setup flask and Mongo
app = Flask(__name__)
mongo = PyMongo(app, uri="mongodb://localhost:27017/employment_app")

print(mongo.employmentDB.list_collection_names())