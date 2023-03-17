import * as React from "react";
import { Button, Grid, Typography, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PokerTableImage from "../../assets/pokertable.svg";
import GoldPotImg from "../../assets/goldpot.svg";
import CoinImg from "../../assets/coin.svg";
import GameBaseButton from "../../assets/Game/GameBaseButton.svg";
import CashOutBack from "../../assets/cashoutback.svg";
import "../../styles/game.css";
import MaskedText from "../MaskedText";
import CardEntity from "../../assets/cards/CardEntity";
import { GameState } from "../../engine/game";
import convertCardstoStrings from "../../engine/cardconversion";

interface GameEndProps {
  open: boolean;
  handleClose: () => void;
  resetGameState: (arg0: boolean) => void;
  gameState: GameState;
  pot: number;
  balance: number;
  result: string;
}
interface NextGameButtonProps {
  resetGameState: (arg0: boolean) => void;
  handleClose: () => void;
  gameState: GameState;
}

const NextGameButton = ({ resetGameState, handleClose, gameState }: NextGameButtonProps) => {
  const forNextTournamentbutnotNextGame = gameState.players[0].balance === 0;
  return (
    <Button
      onClick={() => {
        resetGameState(forNextTournamentbutnotNextGame);
        handleClose();
      }}
      sx={{
        backgroundImage: `url(${GameBaseButton})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "15vw",
        height: "10vh",
      }}
    >
      {!forNextTournamentbutnotNextGame && <MaskedText text="Click to Continue" fontSize="1.5rem" />}
      {forNextTournamentbutnotNextGame && <MaskedText text="Restart Game" fontSize="1.5rem" />}
    </Button>
  );
};

const CashOutButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        navigate("/home");
      }}
      sx={{
        backgroundImage: `url(${CashOutBack})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "10vw",
        marginTop: "3vh",
        marginBottom: "3vh",
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
  );
};

const GameEnd = ({ open, handleClose, resetGameState, gameState, pot, balance, result }: GameEndProps) => {
  if (gameState.players.length === 0) return null;
  const ChatGPTCards = convertCardstoStrings(gameState.players[1].hand);
  const UserCards = convertCardstoStrings(gameState.players[0].hand);
  const CommunityCards = convertCardstoStrings(gameState.table);
  return (
    <Modal open={open} onClose={handleClose}>
      <Grid
        container
        sx={{ width: "100vw", height: "100vh", justifyContent: "center", alignContent: "center", alignItems: "center" }}
      >
        <Grid item sx={{ width: "80vw", height: "90vh", position: "fixed", left: "10vw", top: "5vh", zIndex: "-1" }}>
          <img src={PokerTableImage} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </Grid>

        <Grid container sx={{ width: "100vw", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
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
              You
            </Typography>
          </Grid>
        </Grid>
        <Grid container sx={{ width: "100vw", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
          <Grid item xs={1} />
          <Grid
            item
            xs={1.5}
            sx={{ display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}
          >
            <CardEntity className="endgame-card" card={ChatGPTCards[0]} />
          </Grid>
          <Grid
            item
            xs={1.5}
            sx={{ display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}
          >
            <CardEntity className="endgame-card" card={ChatGPTCards[1]} />
          </Grid>
          <Grid
            item
            xs={1.5}
            sx={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <img src={GoldPotImg} style={{ width: "10vw", height: "10vh" }} alt="Gold Pot" />
            <Typography
              sx={{
                fontFamily: "Joystix",
                fontSize: "1.5rem",
                textShadow: "0px 4px 0px #5D0A9D",
                color: "white",
              }}
            >
              {pot}
            </Typography>
          </Grid>
          <Grid
            item
            xs={1.5}
            sx={{ display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}
          >
            <CardEntity className="endgame-card" card={UserCards[0]} />
          </Grid>
          <Grid
            item
            xs={1.5}
            sx={{ display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}
          >
            <CardEntity className="endgame-card" card={UserCards[1]} />
          </Grid>
          <Grid item xs={1} />
        </Grid>
        <Grid
          item
          sx={{
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            height: "40vh",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <NextGameButton resetGameState={resetGameState} handleClose={handleClose} gameState={gameState} />
          <CashOutButton />
          <Grid item sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src={CoinImg} style={{ width: "5vw", height: "5vh" }} alt="Coin" />
            <Typography
              sx={{
                fontFamily: "Joystix",
                fontSize: "1.0rem",
                textShadow: "0px 4px 0px #5D0A9D",
                color: "white",
              }}
            >
              Current Balance: {balance}
            </Typography>
          </Grid>
          <Grid item sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Typography
              sx={{
                fontFamily: "Joystix",
                fontSize: "1.0rem",
                textShadow: "0px 4px 0px #5D0A9D",
                color: "white",
              }}
            >
              {result}
            </Typography>
          </Grid>
          <Grid container className="community-cards" sx={{ height: "20vh" }}>
            <CardEntity card={CommunityCards[0]} />
            <CardEntity card={CommunityCards[1]} />
            <CardEntity card={CommunityCards[2]} />
            <CardEntity card={CommunityCards[3]} />
            <CardEntity card={CommunityCards[4]} />
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default GameEnd;
