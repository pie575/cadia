#-----------------------------------------------------------------------
# backend.py
# Author: Tharun and Jackie 
#-----------------------------------------------------------------------

from sys import stderr
from flask import Flask, request, make_response
from flask import render_template   #Do we need this?
from firebase import get_score, post_score

#-----------------------------------------------------------------------

app = Flask(__name__, template_folder='.')

#-----------------------------------------------------------------------

# APP LOGIC GOES HERE
@app.route('/', methods=['GET'])        # SAMPLE TEXT
def index():

    return None