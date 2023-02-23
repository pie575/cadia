import * as React from "react";
import { Button, Grid, Typography } from "@mui/material";
import PokerTableImage from "../assets/pokertable.svg";
import GoldPotImg from "../assets/goldpot.svg";
import CoinImg from "../assets/coin.svg";
import CommunityCards from "../components/Game/CommunityCards";
import UserCards from "../components/Game/UserCards";
import GameButton from "../components/Game/GameButton";
import CashOutBack from "../assets/cashoutback.svg";
import { GameState, startRound, dealBlinds, check, raise, call, fold, 
  RoundisOver, checkResult, avaliableActions, computeHand} from "../engine/game";
import { Holdem } from "../engine/Holdem";
import { Deck } from "../engine/Deck";
import "../styles/game.css";
import RaiseOverlay from "../components/Game/RaiseOverlay";
import CashOutDialog from "../components/Game/CashOutDialog";
import ChatGPTUpdate from "../components/Game/ChatGPTUpdate";
// import MaskedText from "../components/MaskedText";

const GameLay = (bigBlind_amount: number) => {
  const [raiseOverlayOpen, setRaiseOverlayOpen] = React.useState<boolean>(false);
  const [cashOutDialogOpen, setCashOutDialogOpen] = React.useState<boolean>(false);
  const [chatGPTMessageOpen, setchatGPTMessageOpen] = React.useState<boolean>(false);

  const userIndex = 1;
  const playerMoney = [100, 100];
  let player_turn = false 
  
  const [gameState, setGameState] = React.useState<GameState>({
    pot: 0,
    deck: new Deck(),
    __instance: new Holdem(),
    table: [],
    round: [],
    __roundStates: [],
    bigBlind_amount,
    bigBlind_index: 0,
    smallBlind_index: 1,
    roundNumber: 0,
    last_player_raised: 0,
    communityCards: [],
    players: [],
  });
  
  const setStatehelper = (updatedState: Partial<GameState>) => {
    setGameState({ ...gameState, ...updatedState });
  };

  /* Initialize game */
  React.useEffect(() => {
    setGameState({ ...gameState, deck: gameState.deck.shuffle()});
    setGameState({ ...gameState, players: playerMoney.map((balance:number, index:number)=> { /* Initialize players (only balance carry over) */
        return {
            balance,
            hand:gameState.deck.getCards(2),
            folded:false,
            active:true,
            allIn: false,
            bigBlind: false, /* will be set later */
            smallBlind: false, /* will be set later */
            id: index, 
        }
      })
    });
    /* initialize player big blind and small blind */
    let bigBlind_index = gameState.bigBlind_index;
    let smallBlind_index = gameState.smallBlind_index;
    let players_copy = gameState.players;
    players_copy[bigBlind_index].bigBlind = true;
    players_copy[smallBlind_index].smallBlind = true;
    setStatehelper({players: players_copy});
  }, []);

  React.useEffect(() => {
  }, []);

  function handleFold(index: number) {
    fold(gameState, index, setStatehelper);
  }
  function handleRaise(index: number, amount_to_raise: number) {
    raise(gameState, index, amount_to_raise, setStatehelper);
  }
  function handleCall(index: number) {
    call(gameState, index, setStatehelper);
  }
  function handleCheck(index: number, roundNumber: number) {
    check(gameState, index, roundNumber, setStatehelper);
  }
  let roundNumber = 1;
  let single_player_left = false;

  React.useEffect(() => {
    if (roundNumber === 5) {
      return;
    }
    startRound(gameState, roundNumber, setStatehelper); // visaulize delt cards
    console.log('community cards', gameState.communityCards);
    if (roundNumber == 1) {
      dealBlinds(gameState, setStatehelper); // visualize
    }
    
    /* if the number of players who haven't all-in are less than 1, continue the game and skip the decision stage */
    let nonallin_active_players = gameState.players.filter((p: { active: any; folded: any; allIn: any; }) => p.active === true && p.folded === false && p.allIn === false);
    if (nonallin_active_players.length <= 1) {
        console.log('community cards', gameState.communityCards);
        roundNumber++;
    }
    else {
        decisionStage(gameState, roundNumber);
    }
    roundNumber++;
    if (roundNumber === 5 || single_player_left) {
      var result = checkResult(gameState, single_player_left, setStatehelper);
      if (result.type === 'win') {
        if (result.index != undefined)
          console.log('Player' + (result.index + 1) + ' won with ' + result.name);
      } 
      else {
          console.log('Draw');
      }
    }
  }, [roundNumber]);
  
  let id = 0;
  let round_is_over = false;
  /* pre-check for this round before player id takes action */
  for (let i = 0; i < 5; i++) {
  React.useEffect(() => {
    if (gameState.players[id].active === false || gameState.players[id].folded === true || gameState.players[id].allIn === true) {
      let next_player = id + 1;
      if (next_player === gameState.players.length) {
          next_player = 0;
      }
      if (next_player === gameState.last_player_raised) {
          round_is_over = RoundisOver(gameState);
          if (round_is_over) {
              break;
          }
          else {
              throw new Error('this error should not happen');
          }
      }
      return;
    }
    let active_players = gameState.players.filter((p: { active: any; folded: any}) => p.active === true && p.folded === false);
    if (active_players.length === 1) {
        round_is_over = true;
        single_player_left = true;
        return;
    }
    let avaliable_actions = avaliableActions(gameState, id);
    console.log("\n Player " + id + ", you can take the following actions: " + avaliable_actions);
  }, [id, round_is_over]);}
  player_turn = true; // player can take action
  timer = setTimeout(() => {
    player_turn = false; // player cannot take action
    let next_player = id + 1;
    if (next_player === gameState.players.length) { 

      next_player = 0;
    }

  React.useEffect(() => {
    let next_player = id + 1;
    if (next_player === gameState.players.length) {
        next_player = 0;
    }
    if (next_player === gameState.last_player_raised) {
        round_is_over = RoundisOver(gameState);
        if (round_is_over) {
            break;
        }
    }
  }, []);


  // const decisionStage = (gameState: GameState, roundNumber: number) => { 
  function decisionStage (gameState: GameState, roundNumber: number) {
      let last_player_raised = 0;
      let round_is_over = false;
      while (!round_is_over) {
        for (let i = 0; i < gameState.players.length; i++) {
            /* if the player is not active, folded, or all-ined, skip this player for this round's decision */
            if (gameState.players[i].active === false || gameState.players[i].folded === true || gameState.players[i].allIn === true) {
                let next_player = i + 1;
                if (next_player === gameState.players.length) {
                    next_player = 0;
                }
                if (next_player === last_player_raised) {
                    round_is_over = RoundisOver(gameState);
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
            let active_players = gameState.players.filter((p: { active: any; folded: any}) => p.active === true && p.folded === false);
            if (active_players.length === 1) {
                round_is_over = true;
                single_player_left = true;
                return;
            }

            let avaliable_actions = avaliableActions(gameState, i); // visualize
            // let max_to_bet = gameState.players[i].balance;
            console.log("\n Player " + i + ", you can take the following actions: " + avaliable_actions);
      
            const waituserInput = async () => {
              const action = await takeAction();
            };
          
            waituserInput();
            // takeAction(game, avaliable_actions, max_to_bet, i);
            // after action, change the state of the game

            /* check if the round is over right before the last player who raised */
            let next_player = i + 1;
            if (next_player === gameState.players.length) {
                next_player = 0;
            }
            if (next_player === last_player_raised) {
                round_is_over = RoundisOver(gameState);
                if (round_is_over) {
                    break;
                }
            }
        }
    }
  }
  }
  return (
    <Grid container>
      <Grid item sx={{ width: "80vw", height: "90vh", position: "fixed", left: "10vw", top: "5vh" }}>
        <img src={PokerTableImage} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </Grid>
      <Grid container className="actual-table" sx={{ marginTop: "3vh" }}>
        <Grid container sx={{ margin: "0 20vw", justifyItems: "flex-start", alignItems: "center" }}>
          <Grid item xs={4} sx={{ display: "flex" }} />
          <Grid
            item
            xs={4}
            sx={{ display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}
          >
            <Typography
              sx={{
                fontFamily: "Joystix",
                fontSize: "2.5rem",
                textShadow: "0px 4px 0px #5D0A9D",
                color: "white",
                height: "10vh",
              }}
            >
              ChatGPT
            </Typography>
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={2}>
            <Grid item sx={{ margin: "auto" }}>
              <Button
                onClick={() => setCashOutDialogOpen(true)}
                sx={{
                  backgroundImage: `url(${CashOutBack})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  width: "10vw",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Joystix",
                    fontSize: "1rem",
                    textShadow: "0px 4px 0px #5D0A9D",
                    color: "white",
                  }}
                >
                  Cash Out
                </Typography>{" "}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{
            position: "relative",
          }}
        >
          <Grid item xs={2.5} />
          <Grid
            item
            xs={1.5}
            sx={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              flex: "center",
              alignItems: "center",
            }}
          >
            <div>
              <img src={GoldPotImg} style={{ width: "10vw", height: "10vh" }} alt="Gold Pot" />
              <Typography
                sx={{
                  fontFamily: "Joystix",
                  fontSize: "1.5rem",
                  textShadow: "0px 4px 0px #5D0A9D",
                  color: "white",
                }}
              >
                100
              </Typography>
            </div>
          </Grid>
          <Grid item xs={4}>
            <CommunityCards />
          </Grid>
          <Grid item xs={4}>
            <UserCards />
          </Grid>
        </Grid>
        <Grid
          container
          sx={{ margin: "0 20vw", justifyItems: "flex-start", alignItems: "center", alignContent: "center" }}
        >
          <Grid item xs={4} sx={{ display: "flex", alignItems: "center" }} />
          <Grid item xs={4} className="gpt-bame">
            <Typography
              sx={{
                fontFamily: "Joystix",
                fontSize: "2.5rem",
                textShadow: "0px 4px 0px #5D0A9D",
                color: "white",
              }}
            >
              You
            </Typography>
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src={CoinImg} style={{ width: "5vw", height: "5vh" }} alt="Coin" />
            <Typography
              sx={{
                fontFamily: "Joystix",
                fontSize: "1.5rem",
                textShadow: "0px 4px 0px #5D0A9D",
                color: "white",
              }}
            >
              100
            </Typography>
          </Grid>
          <Grid container sx={{ width: "65vw", marginTop: "5vh" }}>
            <Grid item xs={3}>
              <GameButton text="fold" onClick={() => handleFold(userIndex)} />
            </Grid>
            <Grid item xs={3}>
              <GameButton text="check" onClick={() => handleCheck(userIndex, gameState.roundNumber)} />
            </Grid>
            <Grid item xs={3}>
              <GameButton text="call" onClick={() => handleCall(userIndex)} />
            </Grid>
            <Grid item xs={3}>
              <GameButton text="raise" onClick={() => setRaiseOverlayOpen(true)} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <RaiseOverlay
        open={raiseOverlayOpen}
        userBalance={100}
        setUserBalance={() => {}}
        addToPot={() => {}}
        handleClose={() => setRaiseOverlayOpen(false)}
        // onClick = {handleRaise(userIndex, amount_to_raise)}
      />
      <ChatGPTUpdate open={chatGPTMessageOpen} handleClose={() => setchatGPTMessageOpen(false)} />
      <CashOutDialog open={cashOutDialogOpen} handleClose={() => setCashOutDialogOpen(false)} />
    </Grid>
  );
};
export default GameLay;