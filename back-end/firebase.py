import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# TODO PUT THIS CREDENTALS SOMEWHERE ELSE
cred = credentials.Certificate("back-end/desocade-firebase-adminsdk-n6sgm-2f4b56e278.json")
default_app = firebase_admin.initialize_app(cred, {
	'databaseURL': "https://desocade-default-rtdb.firebaseio.com/"
})


def post_score(name, wallet_address, score):
	ref = db.reference("/")

	user_wallet = wallet_address
	user_name = name
	user_score = score

	score_ref = ref.child("Scores")
	score_ref.push().set({
		'user_wallet': user_wallet,
		'score': user_score,
		'name': user_name,
	})

# Returns a list of the top num_scores from highest to lowest in the tuple form ('name', 'score', 'wallet_address')
def get_score(num_scores):
	ref = db.reference('Scores')
	# Read the data at the posts reference (this is a blocking operation)

	array = list(ref.order_by_child('score').limit_to_last(num_scores).get().values())
	array.reverse()

	return [tuple(element.values()) for element in array]



def main():
	print(get_score(5))

if __name__ == "__main__":
    main()
