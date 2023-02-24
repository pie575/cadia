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

  const singlePlayerLeft = () => {
    const activePlayers = gameState.players.filter(
      (p: { active: any; folded: any }) => p.active === true && p.folded === false,
    );
    if (activePlayers.length === 1) {
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
    // if (gameState.gameRunning) return;
    fold(gameState, index, setGameStateHelper);
    increasePlayerId(); // next player to take actions
  };

  const handleRaise = (index: number, amount_to_raise: number) => {
    // if (gameState.gameRunning) return;
    raise(gameState, index, amount_to_raise, setGameStateHelper);
    increasePlayerId();
  };

  const handleCall = (index: number) => {
    // if (gameState.gameRunning) return;
    call(gameState, index, setGameStateHelper);
    increasePlayerId();
  };

  const handleCheck = (index: number, roundNumber: number) => {
    // if (gameState.gameRunning) return;
    check(gameState, index, roundNumber, setGameStateHelper);
    increasePlayerId();
  };

  /* Initialize game */
  React.useEffect(() => {
    const bigBlindIndex = gameState.bigBlind_index;
    const smallBlindIndex = gameState.smallBlind_index;
    /* Initialize players (only balance carry over) */
    const newPlayers = playerMoney.map((balance: number, index: number) => {
      return {
        balance: 100,
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
    setGameStateHelper({ players: newPlayers });
    increaseRoundNumber();
  }, []);

  React.useEffect(() => {
    if (gameState.players.length === 0) return;
    setGameStateHelper({ gameRunning: true }); // prevent user from clicking buttons
    /* Check if game is over */
    if (singlePlayerLeft()) {
      const result = checkResult(gameState, true, setGameStateHelper);
      setGameStateHelper({ result });
      return;
    }
    if (gameState.roundNumber === 5) {
      const result = checkResult(gameState, false, setGameStateHelper);
      setGameStateHelper({ result });
      return;
    }

    /* Start this round */
    startRound(gameState, gameState.roundNumber, setGameStateHelper); // visaulize delt cards
    if (gameState.roundNumber === 1) {
      dealBlinds(gameState, setGameStateHelper); // visualize
    }
    setGameStateHelper({ currentplayer_id: -1 }); // toggles forward to tigger this round, set to -1 to guarantee state changes
  }, [gameState.roundNumber, gameState.players]);

  /* major Round Loop, iterate player by player */
  React.useEffect(() => {
    if (gameState.players.length === 0) return;
    if (gameState.currentplayer_id === -1) {
      increasePlayerId(); // start the round with player 0
    }
    setGameStateHelper({ gameRunning: true }); // prevent user from clicking buttons
    /* check if all players have all-ined */
    if (allPlayersAllIned()) {
      if (allPlayersAllIned()) {
        increaseRoundNumber(); // toggles back to trigger next round
      }
      // check if the round is over//
      const id = gameState.currentplayer_id;
      if (id === gameState.last_player_raised) {
        const roundStatus = RoundisOver(gameState);
        if (roundStatus === true) {
          increaseRoundNumber(); // toggles back to trigger next round
        }
      }
      // check if the player is active, folded, or all-ined
      if (
        gameState.players[id].active === false ||
        gameState.players[id].folded === true ||
        gameState.players[id].allIn === true
      ) {
        increasePlayerId(); // loop to trigger next player
      }
      // if more than one player left, enter the decision stage
      if (!singlePlayerLeft()) {
        /* hardcorded AI action */
        if (gameState.currentplayer_id === 0) {
          const ChatGPTAction = getChatGPTResponse(gameState.communityCards, gameState.players[0].hand, gameState.players[1].balance, gameState.round[1].current_bet);
          if (ChatGPTAction === -1) {
            handleFold(0);
          }
          else if (ChatGPTAction === 0) {
            handleCheck(0, gameState.roundNumber);
          }
          else if (ChatGPTAction === gameState.round[1].current_bet - gameState.round[0].current_bet) {
            handleCall(0);
          }
          else {
            handleRaise(0, ChatGPTAction);
          }
          increasePlayerId();
        }
        else {
          setGameStateHelper({ gameRunning: false }); // allow user to take action
        }
      } else {
        increaseRoundNumber(); // if one player left, proceed to end the game
      }
    }
  }, [gameState.currentplayer_id]);

  React.useEffect(() => {
    if (gameState.gameRunning) return;
    const actions = avaliableActions(gameState, 1);
    setUserActions(actions);
  }, [gameState.gameRunning]);

  console.log(userActions);

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
              <GameButton disabled={gameState.gameRunning} text="fold" onClick={() => handleFold(userIndex)} />
            </Grid>
            <Grid item xs={3}>
              <GameButton
                disabled={gameState.gameRunning}
                text="check"
                onClick={() => handleCheck(userIndex, gameState.roundNumber)}
              />
            </Grid>
            <Grid item xs={3}>
              <GameButton disabled={gameState.gameRunning} text="call" onClick={() => handleCall(userIndex)} />
            </Grid>
            <Grid item xs={3}>
              <GameButton disabled={gameState.gameRunning} text="raise" onClick={() => setRaiseOverlayOpen(true)} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <RaiseOverlay
        open={raiseOverlayOpen}
        userBalance={100}
        handleClose={() => setRaiseOverlayOpen(false)}
        handleRaise={handleRaise}
      />
      <ChatGPTUpdate open={chatGPTMessageOpen} handleClose={() => setchatGPTMessageOpen(false)} />
      <CashOutDialog open={cashOutDialogOpen} handleClose={() => setCashOutDialogOpen(false)} />
    </Grid>
  );
};
export default GameLay;
