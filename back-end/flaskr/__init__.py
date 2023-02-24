from flask import Flask
import firebase_admin
from firebase_admin import credentials
from flask_cors import CORS

cred = credentials.Certificate("desocade-firebase-adminsdk-n6sgm-2f4b56e278.json")


def init_app():
  application = Flask(__name__, template_folder='.')
  CORS(application, resources={r"/*": {"origins": "*"}})

  application.config['CORS_HEADERS'] = 'Content-Type'


  firebase_admin.initialize_app(cred, {
    'databaseURL': "https://desocade-default-rtdb.firebaseio.com/"
  })

  from .http.leaderboard import leaderboard
  from .http.chatgpt import chatgpt

  application.register_blueprint(leaderboard, url_prefix='/')
  application.register_blueprint(chatgpt, url_prefix='/')

  return application
