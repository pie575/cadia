import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("desocade-firebase-adminsdk-n6sgm-2f4b56e278.json")
default_app = firebase_admin.initialize_app(cred, {
	'databaseURL': "https://desocade-default-rtdb.firebaseio.com/"
	})

from firebase_admin import db
ref = db.reference("/")

user_wallet = 'SOMEONE"S WALLET ACCOUNT' # TODO: PUT ACTUAL WALLET HERE
score = 700                              # TODO: PUT ACTUAL SCORE HERE

wallet_ref = ref.child(user_wallet)
wallet_ref.push().set({
    'score': score
})