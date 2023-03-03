/* eslint-disable prettier/prettier */
import * as React from "react";
import { Button, Grid, Typography } from "@mui/material";
import PokerTableImage from "../assets/pokertable.svg";
import GoldPotImg from "../assets/goldpot.svg";
import CoinImg from "../assets/coin.svg";
import CommunityCards from "../components/Game/CommunityCards";
import UserCards from "../components/Game/UserCards";
import GameButton from "../components/Game/GameButton";
import CashOutBack from "../assets/cashoutback.svg";
import {getChatGPTResponse} from "../utils/APIConnection";
import {
  GameState,
  startRound,
  dealBlinds,
  check,
  raise,
  call,
  fold,
  RoundisOver,
  checkResult,
  avaliableActions,
} from "../engine/game";
import { Holdem } from "../engine/Holdem";
import { Deck } from "../engine/Deck";
import "../styles/game.css";
import RaiseOverlay from "../components/Game/RaiseOverlay";
import CashOutDialog from "../components/Game/CashOutDialog";
import ChatGPTUpdate from "../components/Game/ChatGPTUpdate";
// import MaskedText from "../components/MaskedText";

const GameLay = () => {
  const bigBlindAmount = 10;
  const userIndex = 1;
  const playerMoney = [100, 100];

  const [raiseOverlayOpen, setRaiseOverlayOpen] = React.useState<boolean>(false);
  const [cashOutDialogOpen, setCashOutDialogOpen] = React.useState<boolean>(false);
  const [chatGPTMessageOpen, setchatGPTMessageOpen] = React.useState<boolean>(false);
  const [userActions, setUserActions] = React.useState<string[]>([]);

  const [gameState, setGameState] = React.useState<GameState>({
    pot: 0,
    deck: new Deck(),
    __instance: new Holdem(),
    table: [],
    round: [],
    __roundStates: [],
    bigBlindAmount,
    bigBlind_index: 0,
    smallBlind_index: 1,
    roundNumber: 0,
    gameRunning: true,
    last_player_raised: 0,
    currentplayer_id: 0,
    communityCards: [],
    players: [],
    /* intiaize a dummy result */
    result: {
      type: "draw",
      index: -1,
    },
  });

  const setGameStateHelper = (updatedState: Partial<GameState>) => {
    setGameState((state) => ({ ...state, ...updatedState }));
  };

  const increaseRoundNumber = () => setGameStateHelper({ roundNumber: gameState.roundNumber + 1 });

  const increasePlayerId = () => {
    let nextPlayer = gameState.currentplayer_id + 1;
    if (nextPlayer >= gameState.players.length) {
      nextPlayer = 0;
    }
    setGameStateHelper({ currentplayer_id: nextPlayer });
  };

  const resetRound = () => {
      const newRound = gameState.round;
      for (let i = 0; i < gameState.players.length; i += 1) {
        newRound[i].current_bet = 0;
        newRound[i].decision = undefined;
      }
      setGameStateHelper({ round: newRound }); // reset round
  }

  const singlePlayerLeft = () => {
    const activePlayers = gameState.players.filter(
      (p: { active: any; folded: any }) => p.active === true && p.folded === false,
    );
    if (activePlayers.length === 1) {
      console.log("line84 singler player left");
      return true;
    }
    return false;
  };

  const allPlayersAllIned = () => {
    const nonAllInActivePlayers = gameState.players.filter(
      (p: { active: any; folded: any; allIn: any }) => p.active === true && p.folded === false && p.allIn === false,
    );
    return !(nonAllInActivePlayers.length >= 1);
  };

  const handleFold = (index: number) => {
    console.log("line 98: handle fold");
    if (gameState.gameRunning) return;
    fold(gameState, index, setGameStateHelper);
    increasePlayerId(); // next player to take actions
  };

  const handleRaise = (index: number, amount_to_raise: number) => {
    if (gameState.gameRunning) return;
    raise(gameState, index, amount_to_raise, setGameStateHelper);
    increasePlayerId();
  };

  const handleCall = (index: number) => {
    if (gameState.gameRunning) return;
    call(gameState, index, setGameStateHelper);
    increasePlayerId();
  };

  const handleCheck = (index: number, roundNumber: number) => {
    if (gameState.gameRunning) return;
    check(gameState, index, roundNumber, setGameStateHelper);
    increasePlayerId();
  };

  const checkavaliableActions = () => {
    const actions = avaliableActions(gameState, 0); // set to 0 for now
    setUserActions(actions);
  };

  /* Initialize the game */
  React.useEffect(() => {
    const bigBlindIndex = gameState.bigBlind_index;
    const smallBlindIndex = gameState.smallBlind_index;
    /* Initialize players (only balance carry over) */
    const newPlayers = playerMoney.map((balance: number, index: number) => {
      return {
        balance,
        hand: gameState.deck.getCards(2),
        folded: false,
        active: true,
        allIn: false,
        bigBlind: false /* will be set later */,
        smallBlind: false /* will be set later */,
        id: index,
      };
    });
    newPlayers[bigBlindIndex].bigBlind = true;
    newPlayers[smallBlindIndex].smallBlind = true;
    setGameStateHelper({ deck: gameState.deck.shuffle() });
    console.log("line 139: shuffled the deck")
    setGameStateHelper({ players: newPlayers });
    console.log("line 142: initialized the players");
    increaseRoundNumber();
    console.log("line 144: increased round number")
  }, []);

  /* Major Round Loop, going through preflop, flop, turn, and river */
  React.useEffect(() => {
    console.log("line149 round number is", gameState.roundNumber)
    if (gameState.players.length === 0) {
      return;
    }
    console.log("line 154: set game running to true");
    setGameStateHelper({ gameRunning: true }); // prevent user from clicking buttons
    /* Check if game is over */
    if (singlePlayerLeft()) {
      const result = checkResult(gameState, true, setGameStateHelper);
      console.log("line 160 players are", gameState.players);
      console.log("line 159 result is", result)
      setGameStateHelper({ result });
      return;
    }
    if (gameState.roundNumber === 5) {
      const result = checkResult(gameState, false, setGameStateHelper);
      console.log("line 165 result is", result)
      setGameStateHelper({ result });
      return;
    }

    /* Start this round */
    startRound(gameState, gameState.roundNumber, setGameStateHelper); // visaulize delt cards
    console.log("line 168: started the round");
      // since the big blind is the last_player_raised for the first round,
    // only set last_player_raised to 0 if it is not the first round 
    if (gameState.roundNumber === 1) {
      dealBlinds(gameState, setGameStateHelper); // dealBlinds initializes the round and last player raised
      console.log("line 171: dealt blinds");
    }
    else {
      setGameStateHelper({ last_player_raised: 0}); 
      resetRound();
    }
    setGameStateHelper({ currentplayer_id: -1 }); // toggles forward to tigger this round, set to -1 to guarantee state changes
  }, [gameState.roundNumber]); // gameState.roundNumber, gameState.players

  /* decision stage Loop, iterate player by player */
  React.useEffect(() => {
    if (gameState.players.length === 0 || gameState.roundNumber === 0) return;
    if (gameState.currentplayer_id === -1) {
      increasePlayerId(); // start the round with player 0
      return;
    }
    console.log("line 188 current player id is ", gameState.currentplayer_id)
    console.log("line 189 round number is ", gameState.roundNumber)
    console.log("line 190 set gamerunning to true")
    setGameStateHelper({ gameRunning: true }); // prevent user from clicking buttons
    /* check if all players have all-ined */
    if (allPlayersAllIned()) {
        increaseRoundNumber(); // toggles back to trigger next round
        return;
    }
    checkavaliableActions(); // check avaliable actions for display purposes
    // check if the round is over//
    const id = gameState.currentplayer_id;
    let someoneTakenAction = false;
    for (let i = 0; i < gameState.players.length; i += 1) {
      if (gameState.players[i].allIn === true) { // all-in counts as action
        someoneTakenAction = true;
      }
      else if (gameState.round[i].decision !== undefined) {
        someoneTakenAction = true;
        break;
      }
    }
    if (id === gameState.last_player_raised && someoneTakenAction) {
      const roundStatus = RoundisOver(gameState);
      if (roundStatus === true) {
        increaseRoundNumber(); // toggles back to trigger next round
        console.log("line 202 round is over with roundnumber = ", gameState.roundNumber);
        return;
      }
    }
    // check if the player is active, folded, or all-ined
    if (
      gameState.players[id].active === false ||
      gameState.players[id].folded === true ||
      gameState.players[id].allIn === true
    ) {
      increasePlayerId(); // loop to trigger next player
      console.log("line213 player ", id, " is not active, folded, or all-ined");
      return;
    }
    // if more than one player left, enter the decision stage
    if (!singlePlayerLeft()) {
      /* hardcorded AI action */
      // set to 1 rn just to test player
      if (gameState.currentplayer_id === 1) {
        console.log("line 222 it's AI turn to take actions");
        // let ChatGPTAction = getChatGPTResponse(gameState.communityCards, gameState.players[0].hand, gameState.players[1].balance, gameState.round[1].current_bet);
        const AIavaliableActions = avaliableActions(gameState, 1);
        console.log("line 225 AI avaliable actions are", AIavaliableActions)
        if (AIavaliableActions.includes("check")) {
          console.log("line 226 AI checked");
          handleCheck(1, gameState.roundNumber);
        }
        else if (AIavaliableActions.includes("call")) {
          console.log("line 229 AI called");
          handleCall(1);
        }
        // if (ChatGPTAction === -1) {
        //   ChatGPTAction = 1;
        //   // handleFold(1);
        // }
        // else if (ChatGPTAction === 0) {
        //   handleCheck(1, gameState.roundNumber);
        // }
        // else if (ChatGPTAction === gameState.round[1].current_bet - gameState.round[0].current_bet) {
        //   handleCall(1);
        // }
        // else {
        //   handleRaise(1, ChatGPTAction);
        // }
      }
      else {
        console.log("line 233: set game running to false");
        setGameStateHelper({ gameRunning: false }); // allow user to take action
      }
    } 
    else {
      increaseRoundNumber(); // if one player left, proceed to end the game
      console.log("line 241: one player left, proceed to end the game")
    }
  }, [gameState.currentplayer_id]); // gameState.currentplayer_id

  React.useEffect(() => {
    console.log("line248 checking gameState", gameState, "gamerunning", gameState.gameRunning);
    if (gameState.gameRunning) return;
    const actions = avaliableActions(gameState, 0); // set to 0 for now
    setUserActions(actions);
  }, [gameState.gameRunning]);

  const checkBalance = () => {
    if (gameState.players.length !== 0 && gameState.players[0].balance) {
      console.log("line 256 successfully checked user's balance ", gameState.players[0].balance);
      return gameState.players[0].balance;
    }
    return 100;
  };

  const showResult = () => {
    if (gameState.result.index === -1) return "";
    let message = "";
    if (gameState.result.index === 0) {
      message = `Congrats you won with ${gameState.result.name}!`;
    }
    else {
      message = "You Lost to the Almighty AI!"
    }
    return message;
  };

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
            { userActions.includes("fold") &&
            <Grid item xs={3}>
              <GameButton disabled={gameState.gameRunning} text="fold" onClick={() => handleFold(0)} />
            </Grid>
            }
            { userActions.includes("check") &&
            <Grid item xs={3}>
              <GameButton
                disabled={gameState.gameRunning}
                text="check"
                onClick={() => handleCheck(0, gameState.roundNumber)}
              />
            </Grid>
            }
            { userActions.includes("call") &&
            <Grid item xs={3}>
              <GameButton disabled={gameState.gameRunning} text="call" onClick={() => handleCall(0)} />
            </Grid>
            }
            { userActions.includes("raise") &&
            <Grid item xs={3}>
              <GameButton disabled={gameState.gameRunning} text="raise" onClick={() => setRaiseOverlayOpen(true)} />
            </Grid>
            } 
            <div color = 'white'>
              The round number is {gameState.roundNumber}.
              Now <b>{gameState.gameRunning ? "is not": "is"}</b> Your Turn. 
              <b>{gameState.gameRunning ? "Buttons are disabled. ": "Please take your actions. "}</b>
              Game Result: {showResult()}
            </div>
          </Grid>
        </Grid>
      </Grid>
      <RaiseOverlay
        open={raiseOverlayOpen}
        userBalance={checkBalance()} 
        handleClose={() => setRaiseOverlayOpen(false)}
        handleRaise={handleRaise}
      />
      <ChatGPTUpdate open={chatGPTMessageOpen} handleClose={() => setchatGPTMessageOpen(false)} />
      <CashOutDialog open={cashOutDialogOpen} handleClose={() => setCashOutDialogOpen(false)} userScore={gameState.players?.[0]?.balance} />
    </Grid>
  );
};
export default GameLay;
