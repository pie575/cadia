import requests as req

body = {
    'card': {
        'suite': 'hearts',
        'value': 5
    }
}
print(req.post('http://127.0.0.1:5000/unfold_card', json = body).json())