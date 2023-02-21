from flask import Flask
from flask import request
import openai
import random

def get_string_card(card):
    card_val = str(card['value'])
    if card_val == '1':
        card_val = 'ace'
    if card_val == '11':
        card_val = 'jack'
    if card_val == '12':
        card_val = 'queen'
    if card_val == '13':
        card_val = 'king'
    return card_val + ' of ' + str(card['suite'])


openai.api_key = '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'
model_engine = "text-davinci-003"

# sample input

player_money = 500

chatGPT_cards = {
    'cards': [
        {
            'suite': 'spades',
            'value': 4
        },
        {
            'suite': 'hearts',
            'value': 4
        }
    ]
}

table_cards = {
    'cards': [
        {
            'suite': 'spades',
            'value': 1
        },
        {
            'suite': 'hearts',
            'value': 1
        },
        {
            'suite': 'hearts',
            'value': 5
        }
    ]
}

prompt = 'Player 1 and Player 2 are playing texas holdem. Player 1 has $'+str(player_money)+'. Player 1 has ' + get_string_card(
    chatGPT_cards['cards'][0]) + ' and ' + get_string_card(chatGPT_cards['cards'][1]) + \
         '. Player 2 has two unknown cards. There is a ' + get_string_card(
    table_cards['cards'][0]) + ', ' + get_string_card(table_cards['cards'][1]) + ', and ' + get_string_card(
    table_cards['cards'][2]) + ' on the ' \
                               'table. How much exactly should Player 1 bet?\nBased on odds and calculations, Player 1 should bet specifically $'


app = Flask(__name__)

@app.get("/chatgpt_response")
def chatgpt_response():
    # Generate a response
    completion = openai.Completion.create(
        engine=model_engine,
        prompt=prompt,
        max_tokens=2,
        n=1,
        stop=None,
        temperature=0.5,
    )

    response = completion.choices[0].text
    curr_val = 0
    for i in response:
        try:
            curr_val = curr_val * 10 + int(i)
        except:
            continue

    if not (curr_val >= 0 and curr_val < player_money):
        print('\nused random val \n')
        curr_val = random.randrange(0, player_money)
    return '\n$' + str(curr_val)

@app.post("/unfold_card")
def unfold_card():
    table_cards['cards'].append(request.json['card'])
    return table_cards
