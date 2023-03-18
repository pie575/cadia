/* eslint-disable prettier/prettier */
import * as React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PokerTableImage from "../assets/pokertable.svg";
import GoldPotImg from "../assets/goldpot.svg";
import CoinImg from "../assets/coin.svg";
import CommunityCards from "../components/Game/CommunityCards";
import UserCards from "../components/Game/UserCards";
import GameButton from "../components/Game/GameButton";
import CashOutBack from "../assets/cashoutback.svg";
import { getChatGPTResponse, getChatGPTChatboxResponse } from "../utils/APIConnection";
import { Message } from "../components/Game/ChatDialog";
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
import convertCardstoStrings from "../engine/cardconversion";
import GameEnd from "../components/Game/GameEnd";
// import MaskedText from "../components/MaskedText";

// implement
// export const [messageData, setMessageData] = React.useState<Message[]>([]);
const GameLay = () => {
  const bigBlindAmount = 10;
  const userIndex = 0;

  const [raiseOverlayOpen, setRaiseOverlayOpen] = React.useState<boolean>(false);
  const [cashOutDialogOpen, setCashOutDialogOpen] = React.useState<boolean>(false);
  const [chatGPTMessageOpen, setchatGPTMessageOpen] = React.useState<boolean>(false);
  const [messageData, setMessageData] = React.useState<Message[]>([]);
  const [gameEndOpen, setGameEndOpen] = React.useState<boolean>(false);
  const [userActions, setUserActions] = React.useState<string[]>([]);
  const [gameState, setGameState] = React.useState<GameState>({
    pot: 0,
    deck: new Deck(),
    __instance: new Holdem(),
    table: [],
    round: [],
    roundStates: [],
    bigBlindAmount,
    bigBlind_index: 0,
    smallBlind_index: 1,
    roundNumber: 0,
    gameNumber: 0,
    PlayerTurn: false,
    ChatGPTTurn: false,
    last_player_raised: 0,
    currentplayer_id: 0,
    players: [],
    /* intiaize a dummy result */
    result: {
      type: "draw",
      index: -1,
    },
  });

  const addMessage = (message: Message) => {
    const messages = messageData;
    messages.push(message);
    setMessageData(messages);
  };

  const setGameStateHelper = (updatedState: Partial<GameState>) => {
    setGameState((state) => ({ ...state, ...updatedState }));
  };

  const increaseRoundNumber = () => {
    setGameStateHelper({ roundNumber: gameState.roundNumber + 1 });
    if (gameState.round.length > 0) {
      const newRoundStates = gameState.roundStates;
      newRoundStates.push(gameState.round.slice(0));
      setGameStateHelper({ roundStates: newRoundStates });
    }
  };
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
    setGameStateHelper({ round: newRound }); 
  };

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
    return !(nonAllInActivePlayers.length > 1);
  };

  const handleFold = (index: number) => {
    if (index === 0 && !gameState.PlayerTurn) return;
    if (index === 1 && !gameState.ChatGPTTurn) return;
    fold(gameState, index, setGameStateHelper);
    increasePlayerId();
  };

  const handleRaise = (index: number, amount_to_raise: number) => {
    if (index === 0 && !gameState.PlayerTurn) return;
    if (index === 1 && !gameState.ChatGPTTurn) return;
    if (amount_to_raise <= 0) {
      throw new Error("amount to raise must be greater than 0");
    }
    raise(gameState, index, amount_to_raise, setGameStateHelper);
    increasePlayerId();
  };

  const handleCall = (index: number) => {
    if (index === 0 && !gameState.PlayerTurn) return;
    if (index === 1 && !gameState.ChatGPTTurn) return;
    call(gameState, index, setGameStateHelper);
    increasePlayerId();
  };

  const handleCheck = (index: number, roundNumber: number) => {
    if (index === 0 && !gameState.PlayerTurn) return;
    if (index === 1 && !gameState.ChatGPTTurn) return;
    check(gameState, index, roundNumber, setGameStateHelper);
    increasePlayerId();
  };

  const checkavaliableActions = () => {
    const actions = avaliableActions(gameState, 0); // set to 0 for now
    setUserActions(actions);
  };

  const allPlayersBetsEqual = () => {
    const bets = gameState.round.map((p: { current_bet: any }) => p.current_bet);
    const maxBet = Math.max(...bets);
    const minBet = Math.min(...bets);
    return maxBet === minBet;
  };

  const checkUserCards = () => {
    if (gameState.players.length !== 0 && gameState.players[0].hand) {
      const cardStrings = convertCardstoStrings(gameState.players[0].hand);
      return cardStrings;
    }
    return [];
  };

  const checkCommunityCards = () => {
    if (gameState.table.length !== 0) {
      const cardStrings = convertCardstoStrings(gameState.table);
      return cardStrings;
    }
    return [];
  };

  const resetGameState = (forNextTournamentbutnotNextGame: boolean) => {
    /* information on players, bigBlind/smallBlind index, and gameNumber is preserved across games but not tournament */
    let newPlayers = gameState.players;
    let bigBlindIndex = gameState.bigBlind_index;
    let smallBlindIndex = gameState.smallBlind_index;
    let gameNumber = gameState.gameNumber + 1;

    if (forNextTournamentbutnotNextGame === true) {
      newPlayers = [];
      bigBlindIndex = 0;
      smallBlindIndex = 1;
      gameNumber = -1;
    }

    setGameStateHelper({
      pot: 0,
      deck: new Deck(),
      __instance: new Holdem(),
      table: [],
      round: [],
      roundStates: [],
      players: newPlayers,
      bigBlindAmount,
      bigBlind_index: bigBlindIndex,
      smallBlind_index: smallBlindIndex,
      last_player_raised: 0,
      roundNumber: 0, //
      gameNumber,
      PlayerTurn: false, //
      ChatGPTTurn: false, //
      currentplayer_id: 0, //
      /* intiaize a dummy result */
      result: {
        type: "draw",
        index: -1,
      },
    });
  };

  /* trigger the first game when user opens the page and trigger later games when this game ends  */
  React.useEffect(() => {
    console.log("line 164: reset game state");
    resetGameState(false);
  }, []);

  /* Initialize the game */
  React.useEffect(() => {
    if (gameState.gameNumber === -1) {
      console.log("user clicked restart game so we set gamenumber form -1 to 1");
      setGameStateHelper({ gameNumber: 1 });
      return;
    }
    if (gameState.gameNumber === 0) {
      return;
    }

    setGameStateHelper({ deck: gameState.deck.shuffle() });
    const playerMoney = [100, 10000]; /* initial player balance */
    /* update the playerMoney if the game is not the first game */
    if (gameState.gameNumber > 1) {
      for (let i = 0; i < gameState.players.length; i += 1) {
        playerMoney[i] = gameState.players[i].balance;
      }
    }
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
    let activePlayers = 0;
    /* if any player has zero balance, set active to false */
    for (let i = 0; i < newPlayers.length; i += 1) {
      if (newPlayers[i].balance === 0) {
        newPlayers[i].active = false;
      } else {
        activePlayers += 1;
      }
    }
    if (activePlayers < 2) {
      setGameStateHelper({ players: newPlayers });
      console.log("line 248: Game is over, user's final score is", newPlayers[0].balance);
      return;
    }

    /* Big blind/small blind indexes will be updated for next game in dealBlinds(), 
    player big/small blind booleans are updated here for this game */
    newPlayers[gameState.bigBlind_index].bigBlind = true;
    newPlayers[gameState.bigBlind_index].smallBlind = false;
    newPlayers[gameState.smallBlind_index].smallBlind = true;
    newPlayers[gameState.smallBlind_index].bigBlind = false;

    console.log("line 260: shuffled the deck");
    setGameStateHelper({ players: newPlayers });
    increaseRoundNumber();
  }, [gameState.gameNumber]);

  /* Major Round Loop, going through preflop, flop, turn, and river */
  React.useEffect(() => {
    console.log("line 267 round number is", gameState.roundNumber);
    if (gameState.players.length === 0 || gameState.roundNumber === 0) {
      return;
    }
    setGameStateHelper({ PlayerTurn: false, ChatGPTTurn: false }); // prevent user from clicking buttons
    /* Check if game is over */
    if (singlePlayerLeft()) {
      const result = checkResult(gameState, true, setGameStateHelper);
      console.log("line 217 players are", gameState.players);
      console.log("line 218 result is", result);
      setGameStateHelper({ result });
      return;
    }
    /* Round Number: 0 (Null), 1 (preflop), 2 (flop), 3 (river), 4 (turn), 5 (exceed max limit, so showdown) */
    if (gameState.roundNumber === 5) {
      const result = checkResult(gameState, false, setGameStateHelper);
      console.log("line 226 result is", result);
      setGameStateHelper({ result });
      return;
    }

    /* Start this round */
    startRound(gameState, gameState.roundNumber, setGameStateHelper); // visaulize delt cards
    console.log("line 235: started the round");
    /* since the big blind is the last_player_raised for the first round, only set last_player_raised to 0 if it is not the first round */
    if (gameState.roundNumber === 1) {
      dealBlinds(gameState, setGameStateHelper); // dealBlinds initializes the round and last player raised
      console.log("line 240: dealt blinds");
    } else {
      setGameStateHelper({ last_player_raised: 0 });
      resetRound();
    }
    setGameStateHelper({ currentplayer_id: -1 }); // toggles forward to tigger this round, set to -1 to guarantee state changes
  }, [gameState.roundNumber]);

  /* decision stage Loop, iterate player by player */
  React.useEffect(() => {
    if (gameState.players.length === 0 || gameState.roundNumber === 0) return;
    if (gameState.currentplayer_id === -1) {
      increasePlayerId(); // start the round with player 0
      return;
    }
    console.log("line 256 current player id is ", gameState.currentplayer_id);
    console.log("line 257 round number is ", gameState.roundNumber);
    setGameStateHelper({ PlayerTurn: false, ChatGPTTurn: false }); // prevent user from clicking buttons
    /* check if all players have all-ined and everyone's bets are equal */
    if (allPlayersAllIned() && allPlayersBetsEqual()) {
      increaseRoundNumber(); // toggles back to trigger next round
      return;
    }
    checkavaliableActions(); // check avaliable actions for display purposes
    // check if the round is over//
    const id = gameState.currentplayer_id;
    let everyoneTakenAction = false;
    const actions = [];
    let bigBlindSkip = false;
    for (let i = 0; i < gameState.players.length; i += 1) {
      // if you are big blind and the round is preflop, your "big blind raise" is not counted as action
      bigBlindSkip =
        gameState.roundNumber === 1 &&
        gameState.round[i].decision === "raise" &&
        gameState.round[i].current_bet === gameState.bigBlindAmount;
      if (!bigBlindSkip) {
        if (gameState.players[i].allIn === true || gameState.round[i].decision !== undefined) {
          // all-in counts as action
          actions.push(true);
        }
      }
    }
    everyoneTakenAction = actions.length === gameState.players.length;
    console.log("line 347 everyoneTakenAction is ", everyoneTakenAction);
    // if the player is the last player to raise or the player checked or called, check if the round is over
    if (
      (id === gameState.last_player_raised ||
        gameState.round[id].decision === "check" ||
        gameState.round[id].decision === "call") &&
      everyoneTakenAction
    ) {
      if (RoundisOver(gameState)) {
        increaseRoundNumber(); // toggles back to trigger next round
        console.log("line 282 round is over with roundnumber = ", gameState.roundNumber);
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
      console.log("line 293 player ", id, " is not active, folded, or all-ined");
      return;
    }
    // if more than one player left, enter the decision stage
    if (!singlePlayerLeft()) {
      if (gameState.currentplayer_id === 1) {
        console.log("line 301 it's AI turn to take actions");
        setGameStateHelper({ ChatGPTTurn: true });

        // const AIavaliableActions = avaliableActions(gameState, 1);
        // console.log("line 305 AI avaliable actions are", AIavaliableActions)
        // if (AIavaliableActions.includes("check")) {
        //   console.log("line 306 AI checked");
        //   handleCheck(1, gameState.roundNumber);
        // }
        // else if (AIavaliableActions.includes("call")) {
        //   console.log("line 310 AI called");
        //   handleCall(1);
        // }
        // else {
        //   throw new Error("AI has no avaliable actions");
        // }
      } else {
        console.log("line 328: set game running to false");
        setGameStateHelper({ PlayerTurn: true }); // allow user to take action
      }
    } else {
      increaseRoundNumber(); // if one player left, proceed to end the game
      console.log("line 334: one player left, proceed to end the game");
    }
  }, [gameState.currentplayer_id]);

  React.useEffect(() => {
    console.log("line 339 checking gameState", gameState, "player turn is ", gameState.PlayerTurn);
    if (!gameState.PlayerTurn) return;
    const actions = avaliableActions(gameState, 0); // set to 0 for now
    setUserActions(actions);
  }, [gameState.PlayerTurn]);

  async function fetchChatGPTReponse() {
    // mapping from roundstates to bets to obtain post rounds
    const pastRounds = gameState.roundStates.map((round) => round[0].current_bet);
    const ChatGPTAction = await getChatGPTResponse(
      gameState.table,
      gameState.players[1].hand,
      gameState.players[0].balance,
      pastRounds,
      gameState.players[1].bigBlind,
      gameState.round[0].current_bet,
      gameState.round[1].current_bet,
      gameState.bigBlindAmount,
    );
    const ChatGPTMessage = await getChatGPTChatboxResponse(
      gameState.table,
      gameState.players[1].hand,
      gameState.players[0].balance,
      pastRounds,
      gameState.players[1].bigBlind,
      gameState.round[0].current_bet,
    );
    // make chatgptmessage from string to Message
    const ChatGPTMessageObj: Message = {
      message: ChatGPTMessage,
      sent: true,
    }
    // store the message in the state messages
    addMessage(ChatGPTMessageObj);

    console.log("line 429 ChatGPTAction is", ChatGPTAction);
    // chatgptaction should return amount_to_raise
    if (ChatGPTAction === -1) {
      console.log("does chatgpt action include fold? ", avaliableActions(gameState, 1).includes("fold"));
      handleFold(1);
    } else if (ChatGPTAction === 0) {
      console.log("does chatgpt action include check? ", avaliableActions(gameState, 1).includes("check"));
      handleCheck(1, gameState.roundNumber);
    } else if (ChatGPTAction === gameState.round[0].current_bet - gameState.round[1].current_bet) {
      console.log("does chatgpt action include call? ", avaliableActions(gameState, 1).includes("call"));
      handleCall(1);
    } else {
      console.log("does chatgpt action include raise? ", avaliableActions(gameState, 1).includes("raise"));
      handleRaise(1, ChatGPTAction);
    }
    setGameStateHelper({ ChatGPTTurn: false });
  }

  React.useEffect(() => {
    if (!gameState.ChatGPTTurn) return;
    console.log("line 431 checking gameState", gameState, "chatgpt turn is ", gameState.ChatGPTTurn);
    fetchChatGPTReponse();
  }, [gameState.ChatGPTTurn]);

  const checkBalance = () => {
    if (gameState.players.length !== 0 && gameState.players[0].balance >= 0) {
      return gameState.players[0].balance;
    }
    return 100;
  };

  const showResult = () => {
    if (gameState.result.index === -1) return "";
    let message = "";
    if (gameState.result.index === 0) {
      if (gameState.result.name === "last standing player") {
        message = `ChatGPT folded. You WON as the ${gameState.result.name}!`;
      } else {
        message = `You WON with ${gameState.result.name}!`;
      }
    } else if (gameState.result.index === 1) {
      if (gameState.result.name === "last standing player") {
        message = `ChatGPT WON as the ${gameState.result.name}!`;
      } else {
        message = `ChatGPT WON with ${gameState.result.name}!`;
      }
    }
    return message;
  };

  const checkPot = () => {
    if (gameState.roundStates.length === 0) return 0;
    let pot = 0;
    for (let i = 0; i < gameState.players.length; i += 1) {
      for (let j = 0; j < gameState.roundStates.length; j += 1) {
        pot += gameState.roundStates[j][i].current_bet;
      }
    }
    return pot;
  };

  const checkRound = () => {
    if (gameState.roundNumber === 0) return "";
    if (gameState.roundNumber === 1) return "Preflop Round: ";
    if (gameState.roundNumber === 2) return "Flop Round: ";
    if (gameState.roundNumber === 3) return "Turn Round: ";
    if (gameState.roundNumber === 4) return "River Round:";
    return "";
  };

  React.useEffect(() => {
    if (gameState.result.index !== -1 && gameState.players[0].balance >= 0) {
      setGameEndOpen(true);
    }
  }, [gameState.result.index]);

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
            sx={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
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
            {gameState.ChatGPTTurn && (
              <Grid container sx={{ alignItems: "center", justifyContent: "center" }}>
                <Typography
                  sx={{
                    fontFamily: "Joystix",
                    fontSize: "0.8rem",
                    textShadow: "0px 4px 0px #5D0A9D",
                    color: "white",
                    marginTop: "0.2rem",
                  }}
                >
                  ChatGPT is thinking...
                </Typography>
              </Grid>
            )}
            {gameState.round.length !== 0 && (
              <Grid container sx={{ alignItems: "center", justifyContent: "center" }}>
                <Typography
                  sx={{
                    fontFamily: "Joystix",
                    fontSize: "0.7rem",
                    textShadow: "0px 4px 0px #5D0A9D",
                    color: "white",
                    marginTop: "0.1rem",
                  }}
                >
                  {(() => {
                    switch (gameState.round[1].decision) {
                      case "raise":
                        switch (true) {
                          case gameState.players[1].bigBlind &&
                            gameState.round[1].current_bet === gameState.bigBlindAmount:
                            return "";
                          default:
                            return `${checkRound()} ChatGPT raised to ${
                              gameState.roundStates.map((round) => round[1].current_bet).reduce((a, b) => a + b, 0) +
                              gameState.round[1].current_bet
                            }`;
                        }
                      case "call":
                        return `${checkRound()} ChatGPT called`;
                      case "fold":
                        return `${checkRound()} ChatGPT folded`;
                      case "check":
                        return `${checkRound()} ChatGPT checked`;
                      default:
                        return "";
                    }
                  })()}
                </Typography>
              </Grid>
            )}
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
                {gameState.pot}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={4}>
            <CommunityCards communityCards={checkCommunityCards()} />
          </Grid>
          <Grid item xs={4}>
            <UserCards userCards={checkUserCards()} />
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
              {checkBalance()}
            </Typography>
          </Grid>
          <Grid container sx={{ width: "65vw", marginTop: "5vh" }}>
            {userActions.includes("fold") && (
              <Grid item xs={3}>
                <GameButton disabled={!gameState.PlayerTurn} text="fold" onClick={() => handleFold(0)} />
              </Grid>
            )}
            {userActions.includes("check") && (
              <Grid item xs={3}>
                <GameButton
                  disabled={!gameState.PlayerTurn}
                  text="check"
                  onClick={() => handleCheck(0, gameState.roundNumber)}
                />
              </Grid>
            )}
            {userActions.includes("call") && (
              <Grid item xs={3}>
                <GameButton disabled={!gameState.PlayerTurn} text="call" onClick={() => handleCall(0)} />
              </Grid>
            )}
            {userActions.includes("raise") && (
              <Grid item xs={3}>
                <GameButton disabled={!gameState.PlayerTurn} text="raise" onClick={() => setRaiseOverlayOpen(true)} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <RaiseOverlay
        open={raiseOverlayOpen}
        userBalance={checkBalance()}
        handleRaise={handleRaise}
        handleClose={() => setRaiseOverlayOpen(false)}
        gameState={gameState}
      />
      <ChatGPTUpdate open={chatGPTMessageOpen} handleClose={() => setchatGPTMessageOpen(false)} />
      <CashOutDialog
        open={cashOutDialogOpen}
        handleClose={() => setCashOutDialogOpen(false)}
        userScore={gameState.players?.[0]?.balance}
        resetGameState={resetGameState}
      />
      <GameEnd
        open={gameEndOpen}
        handleClose={() => setGameEndOpen(false)}
        resetGameState={resetGameState}
        gameState={gameState}
        pot={checkPot()}
        balance={checkBalance()}
        result={showResult()}
      />
    </Grid>
  );
};

export default GameLay;
