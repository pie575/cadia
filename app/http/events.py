from datetime import datetime as dt
from flask import Blueprint, request
from firebase_admin import db

events = Blueprint("events", __name__)


@events.route("/game_start", methods=["POST"])
def post_game_start():
    """
    Push a game start event to Firebase
    """
    event_body = request.get_json()

    ref = db.reference("events")
    start_game_ref = ref.child("game_start")

    user_wallet = event_body["walletId"]
    user_name = event_body["name"]

    event_obj = {
        "name": user_name,
        "user_wallet": user_wallet,
        "created_at": str(dt.utcnow()),
    }

    start_game_ref.push().set(event_obj)

    return event_obj
