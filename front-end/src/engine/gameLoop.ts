/*
Each player is dealt two private cards ("Hole Cards" or "Pocket Cards"), after which there is a betting round.
Then three community cards are dealt face up (the "Flop"), followed by a second betting round. A fourth
community card is dealt face up (the "Turn"), followed by a third betting round. A fifth community card is
dealt face up (the "River")and the the fourth and final betting round. At the Showdown, each player plays the
best five-card hand they can make using any five cards from the two pocket cards and the five community cards
(or Board Cards).
*/

/* initialize the game with 2 players, each having 100 unit money, and big blind is 10 units */

var { Game } = require('./game');
let players_balance = [100, 100]; /* pass in */
let bigBlind_amount = 10
let bigBlind_index = 0;
let smallBlind_index = 1;

/* allow the game to be played as a tournament */
while (true) {
    var game = new Game(players_balance, bigBlind_amount, bigBlind_index, smallBlind_index);
    let roundNames = ['preflop', 'flop', 'turn', 'river'];
    console.log('A new game started');
    console.log('Players hands', game.getState().players.map((p: { hand: any; },i: any) => p.hand));

    var rl = require('readline-sync');
    let single_player_left = false;
    for (let round_number = 1; round_number < 5; round_number++) {
        if (single_player_left) {
            break;
        }
        /* if the number of players who haven't all-in are less than 1, continue the game and skip the decision stage */
        let nonallin_active_players = game.players.filter((p: { active: any; folded: any; allIn: any; }) => p.active === true && p.folded === false && p.allIn === false);
        if (nonallin_active_players.length <= 1) {
            console.log('community cards', game.getState().communityCards);
            game.endRound();
            continue;
        }
        console.log('round ' + roundNames[round_number - 1]);
        console.log('current balance', game.getState().players.map((p: { balance: any; },i: any) => p.balance), ' pot ', game.getState().pot);
        console.log('community cards', game.getState().communityCards);
        game.startRound(round_number);
        let last_player_raised = 0;
        let round_is_over = false;
        while (!round_is_over) {
            for (let i = 0; i < game.players.length; i++) {
                /* if the player is not active, folded, or all-ined, skip this player for this round's decision */
                if (game.players[i].active === false || game.players[i].folded === true || game.players[i].allIn === true) {
                    console.log('Player ' + i + ' is not active, folded, or all-ined, skip this player for this round\'s decision');
                    let next_player = i + 1;
                    if (next_player === game.players.length) {
                        next_player = 0;
                    }
                    if (next_player === last_player_raised) {
                        round_is_over = game.RoundisOver();
                        if (round_is_over) {
                            break;
                        }
                        else {
                            throw new Error('this error should not happen');
                        }
                    }
                    continue;
                }
                /* if there is only one player left, that player won, and the game is over */
                let active_players = game.players.filter((p: { active: any; folded: any}) => p.active === true && p.folded === false);
                if (active_players.length === 1) {
                    round_is_over = true;
                    single_player_left = true;
                    break;
                }

                let avaliable_actions = game.avaliableActions(i);
                let max_to_bet = game.players[i].balance;
                console.log("\n Player " + i + ", you can take the following actions: " + avaliable_actions);
                takeAction(game, avaliable_actions, max_to_bet, i);

                /* check if the round is over right before the last player who raised */
                let next_player = i + 1;
                if (next_player === game.players.length) {
                    next_player = 0;
                }
                if (next_player === last_player_raised) {
                    round_is_over = game.RoundisOver();
                    if (round_is_over) {
                        break;
                    }
                }
            }
        }
        game.endRound();
    }

    function takeAction(game: typeof Game, avaliable_actions: string[], max_to_bet: number, i: number): void {
        console.log(game.getState().players.map((p: { balance: any; },i: any) => p.balance));
        let answer = rl.question('Please input your action: ');
        answer = answer.toLowerCase();
        if (avaliable_actions.includes(answer)) {
            if (answer == "raise") {
                console.log("Player " + i + ", you can bet up to " + max_to_bet);
                let amount_to_raise =  rl.question('Please input your amount: ');
                if (parseInt(amount_to_raise) > max_to_bet) {
                    console.log("Invalid amount! Please input again!");
                }
                else {
                    if (parseInt(amount_to_raise) === max_to_bet) {
                        game.players[i].allIn = true;
                    }
                    game.raise(i, parseInt(amount_to_raise));
                }
            }
            else if (answer == 'call') {
                game.call(i);
            }
            else if (answer == 'fold') {
                game.fold(i);
            }
            else if (answer == 'check') {
                game.check(i);
            }
        }
        else {
            console.log("Invalid action! Please input again!");
            takeAction(game, avaliable_actions, max_to_bet, i);
        }
    }

    var result = game.checkResult(single_player_left);
    if (result.type === 'win') {
        console.log('Player' + (result.index + 1) + ' won with ' + result.name);
    } 
    else {
        console.log('Draw');
    }
    console.log('balance', game.getState().players.map((p: { balance: any; },i: any) => p.balance));
    players_balance = game.players.map((p: { balance: any; },i: any) => p.balance);
    bigBlind_index = game.bigBlind_index;
    smallBlind_index = game.smallBlind_index;
    /* if any player runs out of money, the tournament is over */
    if (players_balance.some((p: any) => p === 0)) {
        break;
    }
}