import { Deck } from "./deck";
import { Card } from "./Card";
import { Holdem, HandValue, Result } from "./Holdem";

interface Player{
    balance:number;
    hand:Array<Card>;
    folded:boolean;
    active:boolean;
}
/* Round represents a player's current investment and decision */
interface Round{
    current_bet:number;
    decision?:"fold"|"raise"|"call"|"check"|"bet";
}
/* Represents game state */
export interface GameState{
    pot:number; /* Current pot amount */
    communityCards:Array<Card>; /* Community cards at the table */
    /* Player statuses */
    players:Array<{
        balance:number, /* Total amount of money a player have - what was betted in this round */
        hand:Array<Card>, /* Player cards */
        folded:boolean, /* Whether the player already folded */
        active:boolean, /* Whether the player is still in the game */
        currentDecision:string, /* current decision */
        currentBet:number, /* current bet amount */
        availableActions:Array<string> /* Actions the player can take at the moment */
    }>;
}
/*
interface Game {
    getState(): GameState;
    getRoundState(): GameState;
    getRoundStates(): Array<GameState>;
    getRound(): number;
    call(): void;
    raise(amount: number): void;
    check(): void;
    bet(amount: number): void;
    fold(): void;
    callEndRound(): void;
    endRound(): void;
    getResults(): Array<Result>;
    computeHand(): Array<HandValue>;
}
*/
export class Game{
    private pot:number=0;
    private players:Array<Player>=[];
    private deck:Deck=new Deck();
    private table:Array<Card>=[];
    private round:Array<Round>=[]; /* mapping each player to their betted amount and decision */
    private __instance:Holdem=new Holdem();
    private initialBet:number;
    private __roundStates:Array<Array<Round>>=[];
    /** Inititalizes the Game
     * @param playerMoney   Array of player money to start with, number of players will be of same length
     * @param initialBet    Minimum betting amount to start with 
     */
    constructor(playerMoney:Array<number>,initialBet:number){
        this.initialBet=initialBet;
        this.newRound(playerMoney);
    }
    /** Starts a new game round: 
     * @param playerMoney Money for individual players 
     */
    private newRound(playerMoney:Array<number>):void{
        this.pot=0;
        this.deck=new Deck();
        this.deck.shuffle();
        this.table=[];
        this.round=[];
        this.__roundStates=[];
        this.players=playerMoney.map((balance:number)=>{
            return {
                balance,
                hand:this.deck.getCards(2),
                folded:false,
                active:true
            }
        });
    }
    /* Returns the current game state */
    getState():GameState{
        return {
            communityCards: this.table.slice(0),
            // pot: this.round.reduce((a,c)=>a+c.money,this.pot),
            pot: this.pot,
            players:this.players.map((p,i)=>{
                let availableActions:Array<string>=[];
                if(p.active){
                    if(this.table.length==0){
                        availableActions.push("bet","fold");
                    }else if(this.round.length){
                        if(this.round[i].decision!="fold"){
                            availableActions.push("raise","call","check","fold")
                        }
                    }
                    // why do we need a bet?
                }
                return {
                    balance:p.balance,
                    hand:p.hand,
                    folded:p.folded,
                    active:p.active,
                    currentDecision:(this.round.length && this.round[i].decision)||'',
                    currentBet:(this.round.length && this.round[i].current_bet)||0,
                    availableActions
                }
            })
        }
    }
    /* Starts the round if not started yet */
    startRound():void{
        let activePlayers=0;
        for(let i=0;i<this.players.length;i++){
            if(this.players[i].balance<=0)
                this.players[i].active=false;
            else{
                activePlayers++;
            }
            this.round[i]={
                current_bet:0, //this.players[i].active?this.initialBet:0
            };
        }
        // if(activePlayers==1){
        //     this.round=[];
        //     throw new Error("Game cannot continue")
        // }
    }
    /** Bet the initial betting amount
     * @param index Player index
     */
    bet(index:number):void{
        if(!this.round.length) throw new Error("Game round not started");
        if(this.round[index].decision) throw new Error("Please proceed to next round");
        this.round[index].current_bet=this.initialBet;
        this.round[index].decision="bet";
    }
    /** Bet 0 unit of money
     * @param index Player index
     */
    check(index:number):void{
        if(!this.round.length) throw new Error("Game round not started");
        if(this.round[index].decision) throw new Error("Please proceed to next round");
        if(this.table.length==0) throw new Error("Cannot check in opening round");
        this.round[index].current_bet=0;
        this.round[index].decision="check";
    }
    /** Raise by a player
     * @param index Player index
     * @param money Raise amount
     */
    raise(index:number,amount_to_raise:number):void{
        if(!this.round.length) throw new Error("Game round not started");
        if(this.players[index].balance<amount_to_raise) throw new Error('Insufficient balance');
        if(this.round[index].decision && this.round[index].decision!="raise") throw new Error("Please proceed to next round");
        let raised_money=amount_to_raise;
        /* If the game is beyond pre-flop, add the amount to the previous raise */
        if(!this.table.length) { 
            raised_money=amount_to_raise+this.initialBet;
        }
        this.round[index].current_bet=raised_money;
        this.round[index].decision="raise";
    }
    /** Call by a player
     * @param index Player index
     */
    call(index:number):void{
        if(!this.round.length) throw new Error("Game round not started");
        //if(this.round[index].decision) throw new Error("Please proceed to next round");
        let max_money=this.round.slice(0).sort((a,b)=>b.current_bet-a.current_bet)[0].current_bet;
        if(max_money==0) max_money=this.initialBet;//fall back to initial betting amount
        this.round[index].current_bet=max_money;
        this.round[index].decision="call";
        // reduce ths player money??
    }
    /** Fold by a player
     * @param index Player index
     */
    fold(index:number):void{
        if(!this.round.length) throw new Error("Game round not started");
        if(this.round[index].decision) throw new Error("Please proceed to next round");
        this.round[index].decision="fold";
        this.players[index].folded=true;
    }
    /* Whether the current round can be ended */
    canEndRound(){
        let last_amount=-1;
        for(let i=0;i<this.round.length;i++){
            if(this.round[i].decision=="fold") continue;
            let money=this.round[i].current_bet;
            /* check if the betted amounts of all players are the same */
            if(last_amount<0)
                last_amount=money;
            else if(money!=last_amount)
                return false;
        }
        return true;
    }
    /* Ends the current round. */
    endRound():void{
        if(!this.round.length) throw new Error("Game round not started");
        if(this.__roundStates.length==4) throw new Error("Round is over, please invoke checkResult");
        let last_amount=-1;
        let pot=0;
        for(let i=0;i<this.round.length;i++){
            if(this.round[i].decision=="fold") continue;
            let money=this.round[i].current_bet;
            if(last_amount<0)
                last_amount=money;
            else if(money!=last_amount)
                throw new Error("Round is not over yet, please call or raise.");
            pot+=money;
        }
        this.pot+=pot;
        this.__roundStates.push(this.round.slice(0));
        if(this.__roundStates.length<4){
            let communityCardCountForThisRound=1;
            if(this.table.length==0) communityCardCountForThisRound=3;
            this.table.push.apply(this.table,this.deck.getCards(communityCardCountForThisRound));
        }
    }
    /* Returns the result of the current round */
    checkResult():Result{
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
        this.newRound(this.players.map(m=>m.balance));
        return result;
    }
    /** Returns the max possible hand value, ignoring community cards.
     * @param hand Array of cards
     */
    computeHand(hand:Array<Card>):HandValue{
        return this.__instance.computeHand(hand,hand);
    }
}
