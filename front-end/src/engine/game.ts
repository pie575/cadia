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
/* Represents GameState: startRound(), dealBlinds(), check(), raise(), call(), fold(), 
RoundisOver(), EndRound(), checkResults(), avaliableActions(), computeHands() */
export interface GameState{
    pot:number; /* Current pot amount */
    communityCards:Array<Card>; /* Community cards at the table */
    roundNumber:number; /* Current round number */
    round:Array<Player_Round>; /* Current round */
    table:Array<Card>; /* Current table cards */
    deck:Deck; /* Current deck */
    __instance:Holdem; /* Current game instance */
    bigBlind_amount:number; /* Current big blind amount */
    bigBlind_index:number; /* Current big blind index */
    smallBlind_index:number; /* Current small blind index */
    __roundStates:Array<Array<Player_Round>>;
    /* Player status */
    players:Array<{
        balance:number, /* Total amount of money a player have - what was betted in this round */
        hand:Array<Card>, /* Player cards */
        folded:boolean, /* Whether the player already folded */
        active:boolean, /* Whether the player is still in the game */
        bigBlind:boolean, /* Whether the player is the big blind. DEPEND ON LAST GAME */
        smallBlind:boolean, /* Whether the player is the small blind.  DEPEND ON LAST GAME */
        allIn:boolean, /* Whether the player is all in */
        id:number, /* Player index, relative seat position */
    }>;
}
/* Starts the round if not started yet */
export function startRound(gameState: GameState, roundNumber: number, setStateHelper: Function):void{
    gameState.round = []; /* Reset the round */
    let copy_players = gameState.players;
    let copy_round = gameState.round;
    let activePlayers=0;
    for(let i=0;i<gameState.players.length;i++){
        if(copy_players[i].balance<0) {
            copy_players[i].active=false; /* Player has negative balance */
        }
            /* or the player is offline */
        else{
            activePlayers++;
        }
        copy_round[i]={
            current_bet:0, 
        };
    }
    
    /* deal cards for this round, skipping the preflop round */
    if (roundNumber != 1) {
        if(gameState.__roundStates.length==5) throw new Error("Round is over, please invoke checkResult");
        let roundStates_copy = gameState.__roundStates;
        let table_copy = gameState.table;
        let deck_copy = gameState.deck;

        roundStates_copy.push(gameState.round.slice(0));
        if(roundStates_copy.length<5){
            let communityCardCountForThisRound=1;
            if(gameState.table.length==0) communityCardCountForThisRound=3;
            table_copy.push.apply(table_copy, deck_copy.getCards(communityCardCountForThisRound));
        }
        setStateHelper({deck: deck_copy, __roundStates:roundStates_copy, table:table_copy});
    }
    setStateHelper({players:copy_players, round:copy_round});
    /* has to be at least 2 players */
    if(activePlayers<=1){
        throw new Error("Game cannot continue with less than 2 players");
    }
}
/** Conduct the big/small blinds for the game, and blinds rotate to the next player
 * @param index Player index
 */
export function dealBlinds(gameState: GameState, setStateHelper: Function):void{
    if(!gameState.round.length) throw new Error("Game round not started");
    let copy_players = gameState.players;
    let copy_round = gameState.round;
    let copy_bigBlind_index = gameState.bigBlind_index;
    let copy_smallBlind_index = gameState.smallBlind_index;
    let total_blinds = 0;
    let foundBigBlind = false;
    let foundSmallBlind = false;
    for (var id = 0; id < copy_players.length; id++) {
        if (copy_players[id].active == false) {
            continue;
        }
        if (copy_players[id].bigBlind == true) {
            total_blinds += gameState.bigBlind_amount;
            copy_players[id].balance-=gameState.bigBlind_amount;
            copy_round[id].current_bet += gameState.bigBlind_amount;
            copy_players[id].bigBlind = false;
            copy_round[id].decision = "raise"; /* big blind is equvialent to a raise in the first round */
            /* find the next player who is still active to be the big blind */
            let nextPlayer = id + 1;
            if (nextPlayer == copy_players.length) {
                nextPlayer = 0;
            }
            while (copy_players[nextPlayer].active == false) {
                nextPlayer++;
                if (nextPlayer == copy_players.length) {
                    nextPlayer = 0;
                }
            }
            copy_players[nextPlayer].bigBlind = true;
            copy_bigBlind_index = nextPlayer;
            foundBigBlind = true;
            break; /* found the big blind, break out of the loop */
        }
    }
    for (var id = 0; id < copy_players.length; id++) {
        if (copy_players[id].active == false) {
            continue;
        }
        if (copy_players[id].smallBlind == true) {
            total_blinds += gameState.bigBlind_amount/2;
            copy_players[id].balance-=gameState.bigBlind_amount/2;
            copy_round[id].current_bet += gameState.bigBlind_amount/2;
            copy_players[id].smallBlind = false;
            /* find the next player who is still active to be the big blind */
            let nextPlayer = id + 1;
            if (nextPlayer == copy_players.length) {
                nextPlayer = 0;
            }
            while (copy_players[nextPlayer].active == false) {
                nextPlayer++;
                if (nextPlayer == copy_players.length) {
                    nextPlayer = 0;
                }
            }
            copy_players[nextPlayer].smallBlind = true;
            copy_smallBlind_index = nextPlayer;
            foundSmallBlind = true;
            break; /* found the big blind, break out of the loop */
        }
    }
    if (foundBigBlind == false || foundSmallBlind == false) {
        throw new Error("Could not find big or small blind");
    }
    let copy_pot = gameState.pot + total_blinds;
    setStateHelper({players:copy_players, round:copy_round, bigBlind_index:copy_bigBlind_index, smallBlind_index:copy_smallBlind_index, pot:copy_pot});
}

/** Bet 0 unit of money
 * @param index Player index
 */
export function check(gameState: GameState, index:number, roundNumber: number, setStateHelper: Function):void{
    if(!gameState.round.length) throw new Error("Game round not started");
    let max_current_bet = gameState.round.slice(0).sort((a,b)=>b.current_bet-a.current_bet)[0].current_bet;
    if (gameState.round[index].current_bet < max_current_bet) throw new Error("Cannot check with a current bet less than the maximum current bet");
    /* do not update decision if the big blind checks on the first round */
    let copy_round = gameState.round;
    if (gameState.bigBlind_index != index && roundNumber != 1) {
        copy_round[index].decision = "check";
        setStateHelper({round:copy_round});
    }
}
/** Raise by a player
 * @param index Player index
 * @param amount_to_raise Raise amount
 */
export function raise(gameState: GameState, index:number,amount_to_raise:number, setStateHelper: Function):void{
    if(!gameState.round.length) throw new Error("Game round not started");
    if(gameState.players[index].balance < amount_to_raise) throw new Error('Insufficient balance to raise');
    let max_current_bet =gameState.round.slice(0).sort((a,b)=>b.current_bet-a.current_bet)[0].current_bet;
    if(amount_to_raise + gameState.round[index].current_bet <= max_current_bet) throw new Error("Cannot raise to less than or equal to the maximum current bet");
    /* reset the decision table of other players for this round if someone raised */
    let copy_round = gameState.round;
    let copy_players = gameState.players;
    let copy_pot = gameState.pot;
    for (let i = 0; i < gameState.round.length; i++) {
        if (i != index) {
            copy_round[i].decision = undefined;
        }
    }
    copy_round[index].current_bet += amount_to_raise;
    copy_round[index].decision="raise";
    copy_players[index].balance-=amount_to_raise;
    copy_pot = amount_to_raise + gameState.pot;
    setStateHelper({round:copy_round, players:copy_players, pot:copy_pot});
}
/** Call by a player
 * @param index Player index
 */
export function call(gameState: GameState, index:number, setStateHelper: Function):void{
    if(!gameState.round.length) throw new Error("Game round not started");
    let max_current_bet =gameState.round.slice(0).sort((a,b)=>b.current_bet-a.current_bet)[0].current_bet;
    if (gameState.round[index].current_bet >= max_current_bet) throw new Error("Cannot call with a current bet greater than or equal to the maximum current bet");
    let amount_to_call = max_current_bet - gameState.round[index].current_bet;
    if(gameState.players[index].balance < amount_to_call) throw new Error('Insufficient balance to call');
    let copy_round = gameState.round;
    let copy_players = gameState.players;
    let copy_pot = gameState.pot;
    copy_round[index].current_bet += amount_to_call;
    copy_round[index].decision="call";
    copy_players[index].balance-=amount_to_call;
    copy_pot += amount_to_call;
    setStateHelper({round:copy_round, players:copy_players, pot:copy_pot});
}
/** Fold by a player
 * @param index Player index
 */
export function fold(gameState: GameState, index:number, setStateHelper: Function):void{
    if(!gameState.round.length) throw new Error("Game round not started");
    let copy_round = gameState.round;
    let copy_players = gameState.players;
    copy_round[index].decision="fold";
    copy_players[index].folded=true;
    setStateHelper({round:copy_round, players:copy_players});
}
/* Whether the current round can be ended, by checking if the current bet for this round is equal */
export function RoundisOver(gameState: GameState):boolean{
    let last_amount=-1;
    for(let i=0;i<gameState.players.length;i++){
        if(gameState.round[i].decision=="fold" || gameState.players[i].active == false) continue;
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
/* Ends the current round. */
// export function endRound(gameState: GameState, setStateHelper: Function):void{
//     // if(!gameState.round.length) throw new Error("Game round not started");
//     if(gameState.__roundStates.length==4) throw new Error("Round is over, please invoke checkResult");
//     let roundStates_copy = gameState.__roundStates;
//     let table_copy = gameState.table;
//     let deck_copy = gameState.deck;

//     /* deal cards for next round */
//     roundStates_copy.push(gameState.round.slice(0));
//     if(roundStates_copy.length<4){
//         let communityCardCountForThisRound=1;
//         if(gameState.table.length==0) communityCardCountForThisRound=3;
//         table_copy.push.apply(table_copy, deck_copy.getCards(communityCardCountForThisRound));
//     }
//     setStateHelper({deck: deck_copy, __roundStates:roundStates_copy, table:table_copy});
// }
/* Returns the result of the current round and Conducts payout */
export function checkResult(gameState: GameState, single_player_left: boolean, setStateHelper: Function):Result{
    let copy_players = gameState.players;
    if (single_player_left) {
        let player_index = gameState.players.findIndex(f => f.active && !f.folded);
        const result: Result = {
            type: 'win',
            index: player_index,
            name: 'last standing player',
        };
        copy_players[player_index].balance += gameState.pot;
        setStateHelper({players: copy_players});
        return result;
    }
    let result=gameState.__instance.compareHands(gameState.players.map(m=>m.hand),gameState.table);
    if(result.type=='win'){
        if(result.index!=undefined)
            copy_players[result.index].balance += gameState.pot;
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
                    copy_players[i].balance += eachSplit;
            }
        }
    }
    setStateHelper({players: copy_players});
    return result;
}
/* Returns the avaliable actions for a player */
export function avaliableActions(gameState: GameState, index:number):Array<string>{
    if(!gameState.round.length) throw new Error("Game round not started");
    let actions:Array<string>=[];
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
            let old_big_blind = index - 1;
            if (old_big_blind < 0) old_big_blind = gameState.players.length - 1;
            if(gameState.players[old_big_blind].bigBlind) {
                actions.push("raise");
            }
            actions.push("check");
            actions.push("fold");
        }
    }
    return actions;
}
export function computeHand(gameState: GameState, hand:Array<Card>):HandValue{
    return gameState.__instance.computeHand(hand,hand);
}



