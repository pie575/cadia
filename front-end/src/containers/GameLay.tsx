import * as React from "react";
import { Grid, Typography } from "@mui/material";
import PokerTableImage from "../assets/pokertable.svg";
import GoldPotImg from "../assets/goldpot.svg";
import CoinImg from "../assets/coin.svg";
import CommunityCards from "../components/Game/CommunityCards";
import UserCards from "../components/Game/UserCards";
import GameButton from "../components/Game/GameButton";
import "../styles/game.css";

const Options = () => {
  return (
    <Grid container sx={{ width: "65vw", marginTop: "5vh" }}>
      <Grid item xs={3}>
        <GameButton available text="fold" onClick={() => {}} />
      </Grid>
      <Grid item xs={3}>
        <GameButton available text="check" onClick={() => {}} />
      </Grid>
      <Grid item xs={3}>
        <GameButton available text="call" onClick={() => {}} />
      </Grid>
      <Grid item xs={3}>
        <GameButton available={false} text="raise" onClick={() => {}} />
      </Grid>
    </Grid>
  );
};
const GameLay = () => {
  // const [gameState, setGameState] = React.useState<GameState>({
  //   pot: 0,
  // });

  // setGameState({ ...gameState, pot: 100 });

  // React.useEffect(() => {
  //   // initialize game
  //   // add user chatgpt
  //   // add player
  // }, []);

  // React.useEffect(() => {
  //   // preround check
  //   // chat gpt user goes
  //   // we "go"
  // }, [roundNumber, roundContinues]);

  return (
    <Grid container>
      <Grid item sx={{ width: "80vw", height: "90vh", position: "fixed", left: "10vw", top: "5vh" }}>
        <img src={PokerTableImage} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </Grid>
      <Grid container className="actual-table" sx={{ marginTop: "3vh" }}>
        <Grid container sx={{ margin: "0 20vw", justifyItems: "flex-start", alignItems: "center" }}>
          <Grid item xs={4} sx={{ display: "flex" }}>
            <img src={CoinImg} style={{ width: "3vw", height: "5vh", marginRight: "5px" }} alt="Gold Coin" />
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
          <Grid item xs={4}>
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
          <Grid item xs={4} />
        </Grid>
        <Grid
          container
          sx={{
            position: "relative",
          }}
        >
          <Grid item xs={3} />
          <Grid item xs={6}>
            <CommunityCards />
          </Grid>
          <Grid item xs={3}>
            <UserCards />
          </Grid>
        </Grid>
        <Grid
          container
          sx={{ margin: "0 20vw", justifyItems: "flex-start", alignItems: "center", alignContent: "center" }}
        >
          <Grid item xs={4} sx={{ display: "flex", alignItems: "center" }}>
            <img src={CoinImg} style={{ width: "3vw", height: "5vh", marginRight: "5px" }} alt="Gold Coin" />
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
          <Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <img src={GoldPotImg} style={{ width: "10vw", height: "10vh" }} alt="Pot of Gold" />
          </Grid>
        </Grid>
        <Options />
      </Grid>
    </Grid>
  );
};

export default GameLay;
