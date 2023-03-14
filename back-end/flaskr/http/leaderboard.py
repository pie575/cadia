from flask import Blueprint, request
from firebase_admin import db

leaderboard = Blueprint("leaderboard", __name__)


@leaderboard.route("/leaderboard", methods=["GET"])
def get_score():
    """
    Returns a list of the top num_scores from highest to lowest in the tuple form
    ('name', 'score', 'wallet_address')
    """
    score_limit = int(request.args.get("count"))
    if score_limit <= 0:
        score_limit = 10

    # Returns a list of the top num_scores from highest to lowest in the tuple form
    # ('name', 'score', 'wallet_address')
    ref = db.reference('Scores')
    # Read the data at the posts reference (this is a blocking operation)
    array = list(ref.order_by_child(
        'score').limit_to_last(score_limit).get().values())
    array.reverse()

    return [tuple(element.values()) for element in array]


@leaderboard.route("/leaderboard", methods=["POST"])
def post_score():
    """Send a score and save it to Firebase"""
    # name, user_wallet, score
    score_body = request.get_json()

    ref = db.reference("Scores")

    print(score_body)

    user_wallet = score_body["user_wallet"]
    user_name = score_body["name"]
    user_score = score_body["score"]

    score_ref = ref.child("Scores")
    score_ref.push().set({
        'user_wallet': user_wallet,
        'score': user_score,
        'name': user_name,
    })

    return score_body
