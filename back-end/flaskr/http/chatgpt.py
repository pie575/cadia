from flask import Blueprint, request
import openai
import random
from flaskr.config import OPENAI_KEY

chatgpt = Blueprint("chatgpt", __name__)

openai.api_key = OPENAI_KEY
model_engine = "text-davinci-003"

def get_string_card(card):
    card_val = str(card['value'])
    if card_val == '14':
        card_val = 'ace'
    if card_val == '11':
        card_val = 'jack'
    if card_val == '12':
        card_val = 'queen'
    if card_val == '13':
        card_val = 'king'
    return card_val + ' of ' + str(card['suite'])


@chatgpt.route("/chatgpt_response", methods=["POST"])
def chatgpt_response():
    inp = request.json
    player_money = int(inp['money'])
    bet = inp['bet']

    inp_prompt = get_prompt(hidden = False, inp = inp)

    completion = openai.Completion.create(
        engine=model_engine,
        prompt=inp_prompt,
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
        curr_val = random.randrange(bet-1, player_money)
    if curr_val == bet-1:
        curr_val = -1
    return str(curr_val)

    
@chatgpt.route("/chatgpt_prompt", methods=["GET"])
def get_prompt_for_chatbox():
    return {'prompt':get_prompt(True,request.json)}

def get_prompt(hidden: bool, inp: dict):
    player_money = inp['money']
    chatGPT_cards = inp['cards']
    current_community = inp['community']
    past_rounds = inp['past_rounds']
    isBigBlind = inp['isBigBlind']
    bet = inp['bet']

    rounds = ['preflop', 'flop','turn', 'river', 'showdown']
    
    prompt_str = 'Player 1 and Player 2 are playing texas holdem.'
    
    if isBigBlind=='True':
        prompt_str += ' Player 1 is big blind, forced to put in $10 at the start of the pre-flop round.'
    else:
        prompt_str += ' Player 2 is big blind, forced to put in $10 at the start of the pre-flop round.'
    
    if hidden:
        prompt_str += ' Player 1 has $' + str(
                player_money) + '. Player 1 has a **** card and a **** card. Player 2 has two unknown cards. There is a '
    else:
        prompt_str += ' Player 1 has $' + str(
                player_money) + '. Player 1 has ' + get_string_card(
                chatGPT_cards[0]) + ' and ' + get_string_card(chatGPT_cards[1]) + \
                    '. Player 2 has two unknown cards. There is a '
    for card in current_community:
        prompt_str += get_string_card(card)+","

    prompt_str = prompt_str[0:-1] + ' on the table. '
    
    curr_round = 0
    for val in past_rounds:
        prompt_str += 'The '+str(rounds[curr_round])+' round ended with $'+str(val)+' added to the table. '
        curr_round+=1
    
    prompt_str +='They are in the '+str(rounds[curr_round]) + 'round, '
    if isBigBlind == 'True':
        prompt_str+= 'and it is Player 1\'s turn. '
    else:
        prompt_str += 'and Player 2 has bet $'+str(bet)+'.\n'
    
    if hidden:
        prompt_str += 'Player 1 has three options: they can fold, they can match the bet, or they can raise it to a new desired value (the maximum of which is $'+str(player_money)+'). What should they do?'
    else:
        prompt_str += 'Player 1 has three options: they can fold, they can match the bet, or they can raise it to a new desired value (the maximum of which is $'+str(player_money)+'). What should they do? I don\'t want an explanation, I just want a numerical answer in the following format, regardless of uncertainty: if folding, say "-1". if matching, say "'+str(bet)+'". if raising, say a number between "'+str(bet)+'" and "'+str(player_money)+'".'
    return prompt_str