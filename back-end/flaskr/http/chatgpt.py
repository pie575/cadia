import random
from flask import Blueprint, request
import openai
from flaskr.config.openai import OPENAI_KEY

chatgpt = Blueprint("chatgpt", __name__)

openai.api_key = OPENAI_KEY
MODEL_ENGINE = "gpt-3.5-turbo"


def get_string_card(card: dict[str, int]) -> str:
    """Convert a card object to its string representation"""
    card_val = str(card['value'])
    if card_val == '14':
        card_val = 'ace'
    if card_val == '11':
        card_val = 'jack'
    if card_val == '12':
        card_val = 'queen'
    if card_val == '13':
        card_val = 'king'
    return card_val + ' of ' + str(card['suit'])


@chatgpt.route("/chatgpt_response", methods=["POST"])
def chatgpt_response():
    """Get a response from ChatGPT"""
    inp = request.json
    player_money = int(inp['money'])
    gpt_curr_bet = int(inp['chatGPTCurrentBet'])
    bet = inp['bet']

    inp_prompt = get_prompt(hidden=False, inp=inp)

    completion = openai.ChatCompletion.create(
        model=MODEL_ENGINE,
        messages=[
            {"role": "system", "content": inp_prompt}
        ],
        max_tokens=2,
    )

    response = completion['choices'][0]['message']['content']
    print("chatgpt repsonse is", response)
    curr_val = 0

    try:
        curr_val = int(response)
    except:
        print('\nused random val \n')
        curr_val = random.randrange(bet - 1, player_money)
        if curr_val == bet - 1:
            curr_val = -1
    
    if curr_val!=-1 and curr_val<int(bet):
        curr_val = bet-gpt_curr_bet
    # print("line 52 curr_val is", curr_val)

    # getting amount to add to bet, instead of final raise amount.

    print("line 63 curr_val is", curr_val, "chatgpt curr bet is", gpt_curr_bet)
    return str(curr_val)


@chatgpt.route("/chatgpt_prompt", methods=["GET"])
def get_prompt_for_chatbox():
    """Get dummy prompt from ChatGPT"""
    return {'prompt': get_prompt(True, request.json)}


def get_prompt(hidden: bool, inp: dict):
    """Generate a ChatGPT prompt given parameters"""
    player_money = inp['money']
    chatgpt_cards = inp['cards']
    current_community = inp['community']
    past_rounds = inp['past_rounds']
    is_big_blind = bool(inp['isBigBlind'])
    print('bigblind?', is_big_blind)
    gpt_curr_bet = inp['chatGPTCurrentBet']
    big_blind_amount = inp['bigBlindAmount']
    bet = inp['bet']

    rounds = ['preflop', 'flop', 'turn', 'river', 'showdown']

    prompt_str = 'Player 1 and Player 2 are playing texas holdem.'

    if is_big_blind:
        prompt_str += f' Player 1 is big blind, forced to put in ${str(big_blind_amount)} at the start of the ' \
                      f'pre-flop round. '
    else:
        prompt_str += f' Player 2 is big blind, forced to put in ${str(big_blind_amount)} at the start of the ' \
                      f'pre-flop round. '

    if hidden:
        prompt_str += f' Player 1 and Player 2 both have ${str(player_money)} . Player 1 has a **** card and a **** ' \
                      f'card. Player 2 has two unknown cards. There is a '
    else:
        prompt_str += f' Player 1 and Player 2 both have ${str(player_money)}. Player 1 has {get_string_card(chatgpt_cards[0])} and {get_string_card(chatgpt_cards[1])}. Player 2 has two unknown cards. '
    if (len(current_community) != 0):
        prompt_str += f' There is a '
        for card in current_community:
            prompt_str += get_string_card(card) + ","

        prompt_str = prompt_str[0:-1] + ' on the table. '

    curr_round = 0
    for val in past_rounds:
        prompt_str += 'The ' + \
            str(rounds[curr_round]) + ' round ended with $' + \
            str(val) + ' added to the table. '
        curr_round += 1

    prompt_str += 'They are in the ' + str(rounds[curr_round]) + ' round, '
    small_blind_amount = int(big_blind_amount) // 2

    # round 1
    if curr_round == 0:
        # gpt small blind and first
        if not is_big_blind and int(gpt_curr_bet) == small_blind_amount:
            prompt_str += f'and it is Player 1\'s turn (Player 1 has already placed the small blind, which is ${str(small_blind_amount)}).\n'

        # player matches small blind, gpt big blind and betting for first time
        elif int(gpt_curr_bet) == int(big_blind_amount) and int(bet) == small_blind_amount:
            prompt_str += f'and Player 2 matched the small blind, which is ${str(small_blind_amount)}.\n'

        # player raises, gpt big blind and betting for first time
        elif curr_round == 0 and int(gpt_curr_bet) == int(big_blind_amount) and int(bet) == small_blind_amount:
            prompt_str += f'and Player 2 raised to ${str(bet)} (including small blind). (Player 1 has already placed ' \
                          f'the big blind, which is ${str(big_blind_amount)}). \n '

        # ... gpt raise, player raises, gpt's turn.
        elif int(gpt_curr_bet) != int(bet):
            # gpt is small blind, and has a non-match bet on the table
            if not is_big_blind and int(gpt_curr_bet) > small_blind_amount:
                prompt_str += f'and after Player 1 bet ${str(gpt_curr_bet)} (including blind amount), Player 2 raised ' \
                              f'to ${str(bet)} (including blind amount).\n '

            # gpt is big blind, and has a non-match bet on the table
            elif is_big_blind and int(gpt_curr_bet) > big_blind_amount:
                prompt_str += f'and after Player 1 bet ${str(gpt_curr_bet)} (including blind amount), Player 2 raised ' \
                              f'to ${str(bet)} (including blind amount).\n '

    # gpt first time betting
    elif int(gpt_curr_bet) == 0:
        # small blind
        if not is_big_blind:
            prompt_str += 'and it is Player 1\'s turn.\n'

        # big blind, player checked
        elif is_big_blind and int(bet) == 0:
            prompt_str += f'and Player 2 bet ${str(bet)}. \n'

        # big blind, player raised
        elif is_big_blind and int(bet) != 0:
            prompt_str += f'and Player 2 raised to ${str(bet)} (including small blind). \n'

    # any other round, ... gpt raise, player raises, gpt's turn
    elif int(gpt_curr_bet) != int(bet) and int(gpt_curr_bet) > 0:
        prompt_str += f'and after Player 1 bet ${str(gpt_curr_bet)}, Player 2 raised to ${str(bet)}.\n'

    if hidden:
        prompt_str += f'Player 1 has three options: they can fold, they can match the current bet, or they can raise ' \
                      f'it to a new desired value (the maximum of which is ${str(player_money)}. What should Player 1' \
                      f' do?'
    else:
        prompt_str += f'Player 1 has three options: they can fold, they can match the bet, or they can raise it to a ' \
                      f'new desired value (the maximum of which is ${str(player_money)}). What should they do?\n\n Numerical Response Layout: if folding, say "-1". if matching, say "{str(bet)}". if raising, say just the number to raise to, without any other text. The number can be between "{str(bet)}" and "{str(player_money)}".\n\nBased on expected value calculations, the best integer response (regardless of uncertainty) according to the above defined numerical response layout is the integer number '

    print('prompt_str:', prompt_str)
    return prompt_str
