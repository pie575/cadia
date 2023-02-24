from flask import Flask
import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("desocade-firebase-adminsdk-n6sgm-2f4b56e278.json")


def init_app():
  application = Flask(__name__, template_folder='.')

  firebase_admin.initialize_app(cred, {
    'databaseURL': "https://desocade-default-rtdb.firebaseio.com/"
  })

  from .http.leaderboard import leaderboard

  application.register_blueprint(leaderboard, url_prefix='/')

  return application
