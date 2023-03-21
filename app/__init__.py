import os
from flask import Flask, send_from_directory
import firebase_admin
from firebase_admin import credentials
from flask_cors import CORS
from app.config import FIREBASE_CREDENTIALS

cred = credentials.Certificate(FIREBASE_CREDENTIALS)

def init_app():
    """Initialize Flask appplication"""
    application = Flask(__name__, static_url_path="", static_folder="../build")
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

    @application.route("/", defaults={"path": ""})
    @application.route("/<path:path>")
    def serve(path):
        """Serve the app's static assets."""
        if path != "" and os.path.exists(application.static_folder + "/" + path):
            return send_from_directory(application.static_folder, path)
        return send_from_directory(application.static_folder, "index.html")

    @application.errorhandler(404)
    def not_found(_):
        """Return an HTTP 404."""
        return send_from_directory(application.static_folder, "index.html")

    return application

app = init_app()
