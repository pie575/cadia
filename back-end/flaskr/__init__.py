from flask import Flask
import firebase_admin
from firebase_admin import credentials
from flask_cors import CORS
from flaskr.config import FIREBASE_CREDENTIALS

cred = credentials.Certificate(FIREBASE_CREDENTIALS)

def init_app():
    application = Flask(__name__, template_folder='.')
    CORS(application, resources={r"/*": {"origins": "*"}})

    application.config['CORS_HEADERS'] = 'Content-Type'


    # can we remove databaseURL?
    firebase_admin.initialize_app(cred, {
        'databaseURL': "https://desocade-default-rtdb.firebaseio.com/"
    })

    from .http.leaderboard import leaderboard
    from .http.chatgpt import chatgpt

    application.register_blueprint(leaderboard, url_prefix='/')
    application.register_blueprint(chatgpt, url_prefix='/')

    return application
