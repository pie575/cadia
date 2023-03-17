import { Deck } from "./Deck";
import { Card } from "./Card";
import { Holdem, HandValue, Result } from "./Holdem";

interface Player{
    balance:number; /* sticks to this player */
    hand:Array<Card>; /* sticks to this game */
    allIn:boolean; /* sticks to the game */
    folded:boolean; /* sticks to this game */
    id: number; /* sticks to this tournament */
    active:boolean; /* sticks to this tournament */
    bigBlind:boolean; /* sticks to this tournament */
    smallBlind:boolean; /* sticks to this tournament */
}
/* Round represents a player's current investment and decision */
interface Player_Round{
    current_bet:number;
    decision?:"fold"|"raise"|"call"|"check"|"bet";
}

interface Player {
    balance:number, /* Total amount of money a player have - what was betted in this round */
    hand:Array<Card>, /* Player cards */
    folded:boolean, /* Whether the player already folded */
    active:boolean, /* Whether the player is still in the game */
    bigBlind:boolean, /* Whether the player is the big blind. DEPEND ON LAST GAME */
    smallBlind:boolean, /* Whether the player is the small blind.  DEPEND ON LAST GAME */
    allIn:boolean, /* Whether the player is all in */
    id:number, /* Player index, relative seat position */
}

/* Represents GameState: startRound(), dealBlinds(), check(), raise(), call(), fold(), 
RoundisOver(), EndRound(), checkResults(), avaliableActions(), computeHands() */
export interface GameState{
    pot:number; /* Current pot amount */
    roundNumber:number; /* Current round number */
    gameNumber:number; /* Current game number */
    round:Array<Player_Round>; /* Current round */
    table:Array<Card>; /* Current table cards */
    deck:Deck; /* Current deck */
    __instance:Holdem; /* Current game instance */
    bigBlindAmount:number; /* Current big blind amount */
    bigBlind_index:number; /* Current big blind index */
    smallBlind_index:number; /* Current small blind index */
    last_player_raised: number;
    PlayerTurn: boolean;
    ChatGPTTurn: boolean;
    currentplayer_id: number;
    result: Result;
    roundStates:Array<Array<Player_Round>>;
    /* Player status */
    players:Array<Player>;
}
/* Starts the round if not started yet */
export function startRound(gameState: GameState, roundNumber: number, setGameStateHelper: Function):void{
    if (roundNumber < 1 || roundNumber > 4) return;
    console.log('gameState in StartRound', gameState);
    let newPlayers = gameState.players;
    let newRound = gameState.round;
    for(let i=0;i<gameState.players.length;i++){
        newRound[i]={
            current_bet:0, 
            decision:undefined,
        };
    }
    
    /* deal cards for this round, skipping the preflop round */
    if (roundNumber != 1) {
        if(gameState.roundStates.length==5) throw new Error("Round is over, please invoke checkResult");
        let table_copy = gameState.table;
        let deck_copy = gameState.deck;
        if(gameState.roundStates.length<5){
            let communityCardCountForThisRound=1;
            if(gameState.table.length==0) communityCardCountForThisRound=3;
            table_copy.push.apply(table_copy, deck_copy.getCards(communityCardCountForThisRound));
        }
        setGameStateHelper({deck: deck_copy, table:table_copy});
    }
    setGameStateHelper({players:newPlayers, round:newRound, last_player_raised: -1});
    console.log("StartRound done, updated the players and round of gamestate")
}
/** Conduct the big/small blinds for the game, and blinds rotate to the next player
 * @param index Player index
 */
export function dealBlinds(gameState: GameState, setGameStateHelper: Function):void{
    if(!gameState.round.length) throw new Error("Game round not started");
    let newPlayers = gameState.players;
    let newRound = gameState.round;
    let newbigBlindIndex = gameState.bigBlind_index; // for this round
    let newsmallBlindIndex = gameState.smallBlind_index; // for this round
    let newLastPlayerRaised = gameState.last_player_raised;
    let total_blinds = 0;
    let someoneAllINneedReFund = false;
    for (var id = 0; id < newPlayers.length; id++) {
        if (newPlayers[id].active == false) {
            continue;
        }
        // deal with all-in in big blind cases
        if (newPlayers[id].bigBlind) {
            if (newPlayers[id].balance > gameState.bigBlindAmount) {
                newPlayers[id].balance-=gameState.bigBlindAmount;
                total_blinds += gameState.bigBlindAmount;
                newRound[id].current_bet += gameState.bigBlindAmount;
                newRound[id].decision = "raise"; /* big blind is equvialent to a raise in the first round */
                newLastPlayerRaised = id;
            }
            else {
                total_blinds += newPlayers[id].balance;
                newPlayers[id].balance = 0;
                newPlayers[id].allIn = true;
                newRound[id].current_bet += newPlayers[id].balance;
                if (newRound[id].current_bet > gameState.bigBlindAmount/2) {
                    newRound[id].decision = "raise";
                    newLastPlayerRaised = id;
                }
                else {
                    newRound[id].decision = "call";
                    someoneAllINneedReFund = true;
                }
            }
            /* find the next player who is still active to be the big blind */
            let nextPlayer = id + 1;
            if (nextPlayer == newPlayers.length) {
                nextPlayer = 0;
            }
            while (newPlayers[nextPlayer].active == false) {
                nextPlayer++;
                if (nextPlayer == newPlayers.length) {
                    nextPlayer = 0;
                }
            }
            newbigBlindIndex = nextPlayer;
            break; /* found the big blind, break out of the loop */
        }
    }
    for (var id = 0; id < newPlayers.length; id++) {
        if (newPlayers[id].active == false) {
            continue;
        }
        if (gameState.players[id].smallBlind) {
            if (newPlayers[id].balance > gameState.bigBlindAmount/2) {
                newPlayers[id].balance-=gameState.bigBlindAmount/2;
                total_blinds += gameState.bigBlindAmount/2;
                newRound[id].current_bet += gameState.bigBlindAmount/2;
            }
            else {
                total_blinds += newPlayers[id].balance;
                newPlayers[id].balance = 0;
                newPlayers[id].allIn = true;
                newRound[id].current_bet += newPlayers[id].balance;
                newRound[id].decision = "call";
                someoneAllINneedReFund = true;
            }
            /* find the next player who is still active to be the big blind */
            let nextPlayer = id + 1;
            if (nextPlayer == newPlayers.length) {
                nextPlayer = 0;
            }
            while (newPlayers[nextPlayer].active == false) {
                nextPlayer++;
                if (nextPlayer == newPlayers.length) {
                    nextPlayer = 0;
                }
            }
            newsmallBlindIndex = nextPlayer;
            break; /* found the big blind, break out of the loop */
        }
    }
    if (someoneAllINneedReFund) {
        /* find the lowest player bet and refund the other players */
        let lowestPlayerBet = newRound.slice(0).sort((a,b)=>a.current_bet-b.current_bet)[0].current_bet;
        for (var id = 0; id < newPlayers.length; id++) {
            if (newPlayers[id].active == false) {
                continue;
            }
            if (newRound[id].current_bet != lowestPlayerBet) {
                newPlayers[id].balance += newRound[id].current_bet - lowestPlayerBet ;
                newRound[id].current_bet = lowestPlayerBet;
            }
        }
        console.log("non All-in players are refunded", newPlayers, newRound)
    }
    let newPot = gameState.pot + total_blinds;
    setGameStateHelper({players:newPlayers, round:newRound, bigBlind_index: newbigBlindIndex, 
        smallBlind_index:newsmallBlindIndex, pot:newPot, last_player_raised: newLastPlayerRaised});
}

/** Bet 0 unit of money
 * @param index Player index
 */
export function check(gameState: GameState, index:number, roundNumber: number, setGameStateHelper: Function):void{
    if(!gameState.round.length) throw new Error("Game round not started");
    let max_current_bet = gameState.round.slice(0).sort((a,b)=>b.current_bet-a.current_bet)[0].current_bet;
    if (gameState.round[index].current_bet < max_current_bet) throw new Error("Cannot check with a current bet less than the maximum current bet");
    /* do not update decision if the big blind checks on the first round */
    let newRound = gameState.round;
    newRound[index].decision = "check";
    setGameStateHelper({round:newRound});
}
/** Raise by a player
 * @param index Player index
 * @param amount_to_raise Raise amount
 */
export function raise(gameState: GameState, index:number,amount_to_raise:number, setGameStateHelper: Function):void{
    if(!gameState.round.length) throw new Error("Game round not started");
    if(gameState.players[index].balance < amount_to_raise) throw new Error('Insufficient balance to raise');
    let max_current_bet =gameState.round.slice(0).sort((a,b)=>b.current_bet-a.current_bet)[0].current_bet;
    if(amount_to_raise + gameState.round[index].current_bet <= max_current_bet) throw new Error("Cannot raise to less than or equal to the maximum current bet");
    /* reset the decision table of other players for this round if someone raised */
    let newRound = gameState.round;
    let newPlayers = gameState.players;
    let newPot = gameState.pot;
    for (let i = 0; i < gameState.round.length; i++) {
        if (i != index) {
            newRound[i].decision = undefined;
        }
    }
    if (amount_to_raise == newPlayers[index].balance) {
        newPlayers[index].allIn = true;
    }
    newRound[index].current_bet += amount_to_raise;
    newRound[index].decision="raise";
    newPlayers[index].balance -=amount_to_raise;
    newPot = amount_to_raise + gameState.pot;
    console.log("line 201 player ", index, " balance: " + newPlayers[index].balance);
    setGameStateHelper({round:newRound, players:newPlayers, pot:newPot, last_player_raised: index});
}
/** Call by a player
 * @param index Player index
 */
export function call(gameState: GameState, index:number, setGameStateHelper: Function):void{
    if(!gameState.round.length) throw new Error("Game round not started");
    let max_current_bet =gameState.round.slice(0).sort((a,b)=>b.current_bet-a.current_bet)[0].current_bet;
    if (gameState.round[index].current_bet >= max_current_bet) throw new Error("Cannot call with a current bet greater than or equal to the maximum current bet");
    let amount_to_call = max_current_bet - gameState.round[index].current_bet;
    if(gameState.players[index].balance < amount_to_call && gameState.players[index].balance > 0) 
        throw new Error('Insufficient balance to call');
    /* player all-in */
    if (gameState.players[index].balance < amount_to_call) {
        amount_to_call = gameState.players[index].balance;
    }
    let newRound = gameState.round;
    let newPlayers = gameState.players;
    let newPot = gameState.pot;
    /* if this player all-ined, reduce the current bet of the other player to the same amount */
    if (amount_to_call == gameState.players[index].balance) {
        newPlayers[index].allIn = true;
        for (let i = 0; i < gameState.round.length; i++) {
            if (i != index && gameState.round[i].current_bet > amount_to_call + gameState.round[index].current_bet) {
                const refund = newRound[i].current_bet - amount_to_call;
                newRound[i].current_bet -= refund;
                newPlayers[i].balance += refund;
            }
        }
    }
    newRound[index].current_bet += amount_to_call;
    newRound[index].decision="call";
    newPlayers[index].balance-=amount_to_call;
    newPot += amount_to_call;
    setGameStateHelper({round:newRound, players:newPlayers, pot:newPot});
}
/** Fold by a player
 * @param index Player index
 */
export function fold(gameState: GameState, index:number, setGameStateHelper: Function):void{
    if(!gameState.round.length) throw new Error("Game round not started");
    let newRound = gameState.round;
    let newPlayers = gameState.players;
    newRound[index].decision="fold";
    newPlayers[index].folded=true;
    setGameStateHelper({round:newRound, players:newPlayers});
}
/* Whether the current round can be ended, by checking if the current bet for this round is equal */
export function RoundisOver(gameState: GameState):boolean{
    let last_amount=-1;
    for(let i=0;i<gameState.players.length;i++){
        if(gameState.round[i].decision=="fold" || gameState.players[i].active == false) 
            continue;
        /* check if all non-folded, active players have checked and bet the same amount */
        let current_bet =gameState.round[i].current_bet;
        if(last_amount<0)
            last_amount=current_bet;
        else if(current_bet!=last_amount) {
            console.log("this round continues")
            return false;
        }
    }
    return true;
}

/* Returns the result of the current round and Conducts payout */
export function checkResult(gameState: GameState, single_player_left: boolean, setGameStateHelper: Function):Result{
    let newPlayers = gameState.players;
    if (single_player_left) {
        let player_index = gameState.players.findIndex(f => f.active && !f.folded);
        const result: Result = {
            type: 'win',
            index: player_index,
            name: "last standing player",
        };
        newPlayers[player_index].balance += gameState.pot;
        setGameStateHelper({players: newPlayers, pot: 0});
        return result;
    }
    let result=gameState.__instance.compareHands(gameState.players.map(m=>m.hand),gameState.table);
    if(result.type=='win'){
        if(result.index!=undefined)
            newPlayers[result.index].balance += gameState.pot;
        else
            throw new Error("This error will never happen");
    }
    /* If there is a tie, split the pot among the non-folded players */
    else{
        let splitCount=gameState.players.filter(f=>!f.folded).length;
        if(splitCount>0){
            let eachSplit=gameState.pot/splitCount;
            for(let i=0;i<gameState.players.length;i++){
                if(!gameState.players[i].folded)
                    gameState.players[i].balance+=eachSplit;
                    newPlayers[i].balance += eachSplit;
            }
        }
    }
    setGameStateHelper({players: newPlayers, pot: 0});
    return result;
}
/* Returns the avaliable actions for a player */
export function avaliableActions(gameState: GameState, index:number):Array<string>{
    if (gameState.round.length == 0) throw new Error("Game round not started");
    let actions:Array<string>=[];
    // if you have all-ined or folded, you can do nothing
    if (gameState.players[index].allIn || gameState.players[index].folded) return actions;
    // if nobody has raised, you can check or raise or fold
    if (gameState.round.filter(p=>p.decision == "raise").length == 0) {
        actions.push("check");
        actions.push("raise");
        actions.push("fold");
    }
    /* if someone has raised */
    else {
        /* if someone else raised, you can call, fold, or raise */
        if (gameState.round[index].decision != "raise") {
            actions.push("call");
            actions.push("fold");
            actions.push("raise");
        }
        /* if you raised, you can check or fold */
        else {
            /* if you raised as a big blind, you can raise this time */
            if(gameState.players[index].bigBlind && gameState.round[index].current_bet == gameState.bigBlindAmount) {
                actions.push("raise");
            }
            actions.push("check");
            actions.push("fold");
        }
    }
    /* you can only check if your current bet is equal to the maximum current bet for this round */
    const max_current_bet = Math.max.apply(Math, gameState.round.map(m=>m.current_bet));
    if (gameState.round[index].current_bet != max_current_bet) {
        actions = actions.filter(f=>f != "check");
        if (actions.indexOf("call") == -1) actions.push("call");
    }
    /* if you have insufficient balance to call, you cannot raise */
    if (gameState.players[index].balance <= max_current_bet - gameState.round[index].current_bet) {
        actions = actions.filter(f=>f != "raise");
    }
    return actions;
}
export function computeHand(gameState: GameState, hand:Array<Card>):HandValue{
    return gameState.__instance.computeHand(hand,hand);
}



