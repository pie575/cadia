import * as React from "react";
import { Button, Grid, Typography, Modal } from "@mui/material";
import PokerTableImage from "../../assets/pokertable.svg";
import GoldPotImg from "../../assets/goldpot.svg";
// import CoinImg from "../../assets/coin.svg";
// import CommunityCards from "./CommunityCards";
// import UserCards from "./UserCards";
// import GameButton from "./GameButton";
import GameBaseButton from "../../assets/Game/GameBaseButton.svg";
import CashOutBack from "../../assets/cashoutback.svg";
import "../../styles/game.css";
import MaskedText from "../MaskedText";
import CardEntity from "../../assets/cards/CardEntity";

interface GameEndProps {
  open: boolean;
  handleClose: () => void;
}

const NextGameButton = () => {
  return (
    <Button
      onClick={() => {}}
      sx={{
        backgroundImage: `url(${GameBaseButton})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "15vw",
        height: "10vh",
      }}
    >
      <MaskedText text="Next Game" fontSize="1.5rem" />
    </Button>
  );
};

const CashOutButton = () => {
  return (
    <Button
      onClick={() => {}}
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

const GameEnd = ({ open, handleClose }: GameEndProps) => {
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
            <CardEntity className="endgame-card" card="3h" />
          </Grid>
          <Grid
            item
            xs={1.5}
            sx={{ display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}
          >
            <CardEntity className="endgame-card" card="3h" />
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
              100
            </Typography>
          </Grid>
          <Grid
            item
            xs={1.5}
            sx={{ display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}
          >
            <CardEntity className="endgame-card" card="3h" />
          </Grid>
          <Grid
            item
            xs={1.5}
            sx={{ display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}
          >
            <CardEntity className="endgame-card" card="3h" />
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
          <NextGameButton />
          <CashOutButton />
          <Grid container className="community-cards" sx={{ height: "20vh" }}>
            <CardEntity card="7h" />
            <CardEntity card="8c" />
            <CardEntity card="3c" />
            <CardEntity card="3c" />
            <CardEntity card="3c" />
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default GameEnd;
