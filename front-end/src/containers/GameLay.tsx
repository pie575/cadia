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
    roundNumber: 1,
    // single_player_left: false,
    // roundIsOver: false,
    // roundIsStarted: false,
    // gameIsStarted: false,
    gameRunning: true,
    last_player_raised: 0,
    currentplayer_id: -1, // start with -1, will be set to 0 when game starts
    communityCards: [],
    players: [],
    /* intiaize a dummy result */
    result: { 
      type: 'draw',
      index: -1,
      name: '',
    },
  });
  
  const setGameStateHelper = (updatedState: Partial<GameState>) => {
    setGameState({ ...gameState, ...updatedState });
  };

  const increaseRoundNumber = () => setGameStateHelper({ roundNumber: gameState.roundNumber + 1 });

  const increasePlayerId = () => {
    let next_player = gameState.currentplayer_id + 1;
    if (next_player >= gameState.players.length) {
      next_player = 0;
    }
    setGameStateHelper({ currentplayer_id: next_player})
  }

  const singlePlayerLeft = () => {
    const activePlayers = gameState.players.filter((p: { active: any; folded: any; }) => p.active === true && p.folded === false);
    if (activePlayers.length === 1) {
      return true;
    }
    return false;
  }

  const ALLPlayersAllIned = () => {
    let nonallin_active_players = gameState.players.filter((p: { active: any; folded: any; allIn: any; }) => p.active === true && p.folded === false && p.allIn === false);
    if (nonallin_active_players.length >= 1) {
      return false;
    }
    return true;
  }

  const handleFold = (index: number) => {
    if (gameState.gameRunning == true) return;
    fold(gameState, index, setGameStateHelper);
    increasePlayerId(); // next player to take actions
  }
  const handleRaise = (index: number, amount_to_raise: number) => {
    if (gameState.gameRunning == true) return;
    raise(gameState, index, amount_to_raise, setGameStateHelper);
    increasePlayerId();
  }
  const handleCall = (index: number) => {
    if (gameState.gameRunning == true) return;
    call(gameState, index, setGameStateHelper);
    increasePlayerId();
  }
  const handleCheck = (index: number, roundNumber: number) => {
    if (gameState.gameRunning == true) return;
    check(gameState, index, roundNumber, setGameStateHelper);
    increasePlayerId();
  }

  /* Initialize game */
  React.useEffect(() => {
    const bigBlind_index = gameState.bigBlind_index;
    const smallBlind_index = gameState.smallBlind_index;
    const newPlayers = playerMoney.map((balance:number, index:number)=> { /* Initialize players (only balance carry over) */
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
    });
    newPlayers[bigBlind_index].bigBlind = true;
    newPlayers[smallBlind_index].smallBlind = true;
    setGameStateHelper({ deck: gameState.deck.shuffle() });
    setGameStateHelper({ players: newPlayers });
    // setGameStateHelper({players: players_copy, gameIsStarted: true}); // trigger next step
  }, []);

  /* Major Game Loop iterating through 'preflop', 'flop', 'turn', 'river' */
  React.useEffect(() => {
    setGameStateHelper({gameRunning: true}); // prevent user from clicking buttons
    // setGameStateHelper({roundNumber: gameState.roundNumber + 1, gameRunning: true, roundIsOver: false}); // handle infinite loop??
    /* Check if game is over */
    if (singlePlayerLeft()) {
      var result = checkResult(gameState, true, setGameStateHelper);
      setGameStateHelper({result: result});
      return;
    }
    else if (gameState.roundNumber === 5) {
      var result = checkResult(gameState, false, setGameStateHelper);
      setGameStateHelper({result: result});
      return;
    }
    /* Start this round */
    startRound(gameState, gameState.roundNumber, setGameStateHelper); // visaulize delt cards
    if (gameState.roundNumber == 1) {
      dealBlinds(gameState, setGameStateHelper); // visualize
    }
    setGameStateHelper({currentplayer_id: 0}); // toggles forward to tigger this round
  }, [gameState.roundNumber]);

  /* major Round Loop, iterate player by player */
  React.useEffect(() => {
    setGameStateHelper({gameRunning: true}); // prevent user from clicking buttons
    /* check if all players have all-ined */
    if (ALLPlayersAllIned()){
      increaseRoundNumber(); // toggles back to trigger next round
    }
    // check if the round is over// 
    const id = gameState.currentplayer_id;
    if (id === gameState.last_player_raised) {
        let round_status = RoundisOver(gameState);
        // setGameStateHelper({roundIsOver: round_status}); // should end????
        if (round_status === true) {
          increaseRoundNumber(); // toggles back to trigger next round
        }
    }
    // check if the player is active, folded, or all-ined
    if (gameState.players[id].active === false || gameState.players[id].folded === true || gameState.players[id].allIn === true) {
      increasePlayerId(); // loop to trigger next player
    }
    // if more than one player left, enter the decision stage
    if (!singlePlayerLeft()) {
      setGameStateHelper({gameRunning: false}); // allow user to take action
    }
    else {
      increaseRoundNumber(); // if one player left, proceed to end the game
    }
  }, [gameState.currentplayer_id]);
  
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