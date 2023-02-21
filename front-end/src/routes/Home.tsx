import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import Ground from "../assets/Home/Ground.png";
import Astronaut from "../assets/Home/Astronaut.svg";
import Scientist from "../assets/Home/Scientist.svg";
import City from "../assets/Home/City.svg";
// import { ReactComponent as StartButton } from "../assets/Home/StartButton.svg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Grid
      container
      sx={{
        height: "100vh",
        width: "100vw",
        alignContent: "start",
        background: "linear-gradient(180deg, #8E32B3 0%, #FFB2DD 100%)",
        zIndex: -1,
        positive: "relative",
      }}
    >
      <Grid item xs={12} sx={{ height: "30vh" }}>
        <Typography sx={{ fontFamily: "Joystix", fontSize: "7rem" }}>BITCADE</Typography>
      </Grid>
      <Grid item xs={12} sx={{ height: "20vh" }}>
        <Typography
          sx={{
            fontFamily: "Joystix",
            fontSize: "2.5rem",
            textShadow: "0px 4px 0px #5D0A9D",
          }}
        >
          Play the game win the chain
        </Typography>
      </Grid>

      {/* <Grid item xs={12} sx={{ flexGrow: 1 }} /> */}
      <Grid container spacing={2} sx={{ height: "32vh", justifyContent: "center", alignItems: "flex-end", zIndex: 1 }}>
        <Grid item xs={4}>
          <img src={Astronaut} style={{ height: "20vh", width: "10vw" }} alt="Astronaut" />
        </Grid>
        <Grid item xs={4} sx={{ margin: "auto" }}>
          <Button onClick={() => navigate("/game")}>
            <Typography sx={{ fontFamily: "Joystix", fontSize: "2rem" }}>START</Typography>
          </Button>
        </Grid>
        <Grid item xs={4}>
          <img src={Scientist} style={{ height: "20vh", width: "10vw" }} alt="Astronaut" />
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          backgroundImage: `url(${City})`,
          backgroundSize: "contain",
          height: "60vh",
          width: "100vw",
          bottom: "5vh",
          left: 0,
          position: "fixed",
        }}
      />
      <Grid
        item
        xs={12}
        style={{
          backgroundImage: `url(${Ground})`,
          backgroundSize: "cover",
          height: "30vh",
          width: "100vw",
          bottom: 0,
          left: 0,
          position: "fixed",
        }}
      />
    </Grid>
  );
};

export default Home;
