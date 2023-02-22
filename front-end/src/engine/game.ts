import { Deck } from "./Deck";
import { Card } from "./Card";
import { Holdem, HandValue, Result } from "./Holdem";

interface Player{
    balance:number; /* sticks to this player */
    hand:Array<Card>; /* sticks to this game */
    // totalBet:number; /* sticks to the game */
    allIn:boolean; /* sticks to the game */
    folded:boolean; /* sticks to this game */
    index: number; /* sticks to this tournament */
    active:boolean; /* sticks to this tournament */
    bigBlind:boolean; /* sticks to this tournament */
    smallBlind:boolean; /* sticks to this tournament */
}
/* Round represents a player's current investment and decision */
interface Player_Round{
    current_bet:number;
    decision?:"fold"|"raise"|"call"|"check"|"bet";
}
/* Represents game state */
export interface GameState{
    pot:number; /* Current pot amount */
    communityCards:Array<Card>; /* Community cards at the table */
    /* Player status */
    players:Array<{
        balance:number, /* Total amount of money a player have - what was betted in this round */
        hand:Array<Card>, /* Player cards */
        folded:boolean, /* Whether the player already folded */
        active:boolean, /* Whether the player is still in the game */
        bigBlind:boolean, /* Whether the player is the big blind. DEPEND ON LAST GAME */
        smallBlind:boolean, /* Whether the player is the small blind.  DEPEND ON LAST GAME */
        allIn:boolean, /* Whether the player is all in */
        index:number, /* Player index, relative seat position */
        // totalBet:number, /* Total amount of money betted in this round */
    }>;
}

/* Represents Game class: getState(), startRound(), dealBlinds(), check(), raise(), call(), fold(), 
RoundisOver(), EndRound(), checkResults(), avaliableActions(), computeHands() */
export class Game{
    private pot:number=0;
    private players:Array<Player>=[];
    private deck:Deck=new Deck();
    private table:Array<Card>=[];
    private round:Array<Player_Round>=[]; /* mapping each player to their current bet and decision */
    private __instance:Holdem=new Holdem();
    private bigBlind:number;
    private bigBlind_index:number;
    private smallBlind_index:number;
    private __roundStates:Array<Array<Player_Round>>=[];
    /** Inititalizes the Game
     * @param playerMoney   Array of player money to start with, number of players will be of same length
     * @param initialBet    Minimum betting amount to start with 
     */
    constructor(playerMoney:Array<number>, bigBlind:number, bigBlind_index:number, smallBlind_index:number){
        this.bigBlind=bigBlind;
        this.bigBlind_index=bigBlind_index;
        this.smallBlind_index=smallBlind_index;
        this.newGame(playerMoney);
    }
    /** Starts a new game round: 
     * @param playerMoney Money for individual players 
     */
    private newGame(playerMoney:Array<number>):void{
        this.pot=0;
        this.deck=new Deck();
        this.deck.shuffle();
        this.table=[];
        this.round=[];
        this.__roundStates=[];
        this.players=playerMoney.map((balance:number)=>{ /* Initialize players (only balance carry over) */
            return {
                balance,
                hand:this.deck.getCards(2),
                folded:false,
                active:true,
                allIn: false,
                bigBlind: false, /* will be set later */
                smallBlind: false, /* will be set later */
                index: 0, /* will be set later */
            }
        });
        /* initialize player index, player balance, player big blind and small blind */
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].index = i;
            if (this.bigBlind_index == i) {
                this.players[i].bigBlind = true;
            }
            if (this.smallBlind_index == i) {
                this.players[i].smallBlind = true;
            }
        }
    }
    /* Returns the current game state */
    getState():GameState{
        return {
            communityCards: this.table.slice(0),
            pot: this.pot,
            players:this.players.map((player,index)=>{
                return {
                    balance:player.balance,
                    hand:player.hand,
                    folded:player.folded,
                    active:player.active,
                    smallBlind: player.smallBlind,
                    bigBlind: player.bigBlind,
                    currentDecision:(this.round.length && this.round[index].decision)||'',
                    currentBet:(this.round.length && this.round[index].current_bet)||0,
                    // totalBet: player.totalBet,
                    allIn: player.allIn,
                    index: player.index,
                }
            })
        }
    }
    /* Starts the round if not started yet */
    startRound(round_number: number):void{
        this.round = []; /* Reset the round */
        let activePlayers=0;
        for(let i=0;i<this.players.length;i++){
            if(this.players[i].balance<0)
                this.players[i].active=false; /* Player has negative balance */
                /* or the player is offline */
            else{
                activePlayers++;
            }
            this.round[i]={
                current_bet:0, 
            };
        }
        /* has to be at least 2 players */
        if(activePlayers<=1){
            this.round=[];
            throw new Error("Game cannot continue with less than 2 players");
        }
        if (round_number == 1) {
            this.dealBlinds();  /* Conduct the blinds and accumulate the blinds as bets for this round */
        }
    }
    /** Conduct the big/small blinds for the game, and blinds rotate to the next player
     * @param index Player index
     */
    dealBlinds():void{
        if(!this.round.length) throw new Error("Game round not started");
        let total_blinds = 0;
        let foundBigBlind = false;
        let foundSmallBlind = false;
        for (var index = 0; index < this.players.length; index++) {
            if (this.players[index].active == false) {
                continue;
            }
            if (this.players[index].bigBlind == true) {
                total_blinds += this.bigBlind;
                this.players[index].balance-=this.bigBlind;
                // this.players[index].totalBet += this.bigBlind;
                this.round[index].current_bet += this.bigBlind;
                this.players[index].bigBlind = false;
                this.round[index].decision = "raise"; /* big blind is equvialent to a raise in the first round */
                console.log("big blind player " + index + " post-blinds balance", this.players[index].balance);
                /* find the next player who is still active to be the big blind */
                let nextPlayer = index + 1;
                if (nextPlayer == this.players.length) {
                    nextPlayer = 0;
                }
                while (this.players[nextPlayer].active == false) {
                    nextPlayer++;
                    if (nextPlayer == this.players.length) {
                        nextPlayer = 0;
                    }
                }
                this.players[nextPlayer].bigBlind = true;
                this.bigBlind_index = nextPlayer;
                foundBigBlind = true;
                break; /* found the big blind, break out of the loop */
            }
        }
        for (let index = 0; index < this.players.length; index++) {
            if (this.players[index].active == false) {
                continue;
            }
            if (this.players[index].smallBlind == true) {
                total_blinds += this.bigBlind/2;
                this.players[index].balance-=this.bigBlind/2;
                // this.players[index].totalBet += this.bigBlind/2;
                this.round[index].current_bet += this.bigBlind/2;
                this.players[index].smallBlind = false;
                console.log("small blind player " + index + " post-blinds balance", this.players[index].balance);
                /* find the next player who is still active to be the small blind */
                let nextPlayer = index + 1;
                if (nextPlayer == this.players.length) {
                    nextPlayer = 0;
                }
                while (this.players[nextPlayer].active == false) {
                    nextPlayer++;
                    if (nextPlayer == this.players.length) {
                        nextPlayer = 0;
                    }
                }
                this.players[nextPlayer].smallBlind = true; 
                this.smallBlind_index = nextPlayer;
                foundSmallBlind = true;
                break; /* found the small blind, break out of the loop */
            }
        }
        if (foundBigBlind == false || foundSmallBlind == false) {
            throw new Error("Could not find big or small blind");
        }
        this.pot += total_blinds;
        console.log("pot after blinds: ", this.pot);
    }
    
    /** Bet 0 unit of money
     * @param index Player index
     */
    check(index:number):void{
        if(!this.round.length) throw new Error("Game round not started");
        let max_current_bet =this.round.slice(0).sort((a,b)=>b.current_bet-a.current_bet)[0].current_bet;
        if (this.round[index].current_bet < max_current_bet) throw new Error("Cannot check with a current bet less than the maximum current bet");
        /* shouldn't define "check" action since the player might have raised before */
        // this.round[index].decision="check";
    }
    /** Raise by a player
     * @param index Player index
     * @param amount_to_raise Raise amount
     */
    raise(index:number,amount_to_raise:number):void{
        if(!this.round.length) throw new Error("Game round not started");
        if(this.players[index].balance < amount_to_raise) throw new Error('Insufficient balance to raise');
        let max_current_bet =this.round.slice(0).sort((a,b)=>b.current_bet-a.current_bet)[0].current_bet;
        if(amount_to_raise + this.round[index].current_bet <= max_current_bet) throw new Error("Cannot raise to less than or equal to the maximum current bet");
        /* reset the decision table of other players for this round if someone raised */
        for (let i = 0; i < this.round.length; i++) {
            if (i != index) {
                this.round[i].decision = undefined;
            }
        }
        this.round[index].current_bet += amount_to_raise;
        this.round[index].decision="raise";
        this.players[index].balance-=amount_to_raise;
        // this.players[index].totalBet += amount_to_raise;
        this.pot += amount_to_raise;
    }
    /** Call by a player
     * @param index Player index
     */
    call(index:number):void{
        if(!this.round.length) throw new Error("Game round not started");
        let max_current_bet =this.round.slice(0).sort((a,b)=>b.current_bet-a.current_bet)[0].current_bet;
        if (this.round[index].current_bet >= max_current_bet) throw new Error("Cannot call with a current bet greater than or equal to the maximum current bet");
        let amount_to_call = max_current_bet - this.round[index].current_bet;
        if(this.players[index].balance < amount_to_call) throw new Error('Insufficient balance to call');
        this.round[index].current_bet += amount_to_call;
        this.round[index].decision="call";
        this.players[index].balance-=amount_to_call;
        // this.players[index].totalBet += amount_to_call;
        this.pot += amount_to_call;
    }
    /** Fold by a player
     * @param index Player index
     */
    fold(index:number):void{
        if(!this.round.length) throw new Error("Game round not started");
        // if(this.round[index].decision) throw new Error("Cannot fold for this round");
        this.round[index].decision="fold";
        this.players[index].folded=true;
    }
    /* Whether the current round can be ended, by checking if the current bet for this round is equal */
    RoundisOver(){
        let last_amount=-1;
        for(let i=0;i<this.players.length;i++){
            if(this.round[i].decision=="fold" || this.players[i].active == false) continue;
            /* check if all non-folded, active players have checked and bet the same amount */
            let current_bet =this.round[i].current_bet;
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
    endRound():void{
        // if(!this.round.length) throw new Error("Game round not started");
        if(this.__roundStates.length==4) throw new Error("Round is over, please invoke checkResult");

        /* deal cards for next round */
        this.__roundStates.push(this.round.slice(0));
        if(this.__roundStates.length<4){
            let communityCardCountForThisRound=1;
            if(this.table.length==0) communityCardCountForThisRound=3;
            this.table.push.apply(this.table,this.deck.getCards(communityCardCountForThisRound));
        }
    }
    /* Returns the result of the current round */
    checkResult(single_player_left: boolean):Result{
        if (single_player_left) {
            let player_index = this.players.findIndex(f => f.active && !f.folded);
            const result: Result = {
                type: 'win',
                index: player_index,
                name: 'last standing player',
            };
            this.players[player_index].balance += this.pot;
            return result;
        }
        let result=this.__instance.compareHands(this.players.map(m=>m.hand),this.table);
        if(result.type=='win'){
            if(result.index!=undefined)
                this.players[result.index].balance+=this.pot;
            else
                throw new Error("This error will never happen");
        }
        /* If there is a tie, split the pot among the non-folded players */
        else{
            let splitCount=this.players.filter(f=>!f.folded).length;
            if(splitCount>0){
                let eachSplit=this.pot/splitCount;
                for(let i=0;i<this.players.length;i++){
                    if(!this.players[i].folded)
                        this.players[i].balance+=eachSplit;
                }
            }
        }
        // this.newGame(this.players.map(m=>m.balance));
        return result;
    }
    /* Returns the avaliable actions for a player */
    avaliableActions(index:number):Array<string>{
        if(!this.round.length) throw new Error("Game round not started");
        let actions:Array<string>=[];
        // if nobody has raised, you can check or raise or fold
        if (this.round.filter(p=>p.decision == "raise").length == 0) {
            actions.push("check");
            actions.push("raise");
            actions.push("fold");
        }
        /* if someone has raised */
        else {
            /* if someone else raised, you can call, fold, or raise */
            if (this.round[index].decision != "raise") {
                actions.push("call");
                actions.push("fold");
                actions.push("raise");
            }
            /* if you raised, you can check or fold */
            else {
                /* if you raised big blind, you can also raise */
                let old_big_blind = index - 1;
                if (old_big_blind < 0) old_big_blind = this.players.length - 1;
                if(this.players[old_big_blind].bigBlind) {
                    actions.push("raise");
                }
                actions.push("check");
                actions.push("fold");
            }
        }
        return actions;
    }
    /** Returns the max possible hand value, ignoring community cards.
     * @param hand Array of cards
     */
    computeHand(hand:Array<Card>):HandValue{
        return this.__instance.computeHand(hand,hand);
    }
}
