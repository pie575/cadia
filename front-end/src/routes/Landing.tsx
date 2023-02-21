import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import Astronaut from "../assets/Home/Astronaut.svg";
import Scientist from "../assets/Home/Scientist.svg";
import Space from "../containers/Space";
import CustomButton from "../components/CustomButton";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Space>
      <Grid item xs={12} sx={{ height: "30vh", zIndex: 1 }}>
        <Typography sx={{ fontFamily: "Joystix", fontSize: "7rem" }}>DESOCADE</Typography>
      </Grid>
      <Grid item xs={12} sx={{ height: "20vh", zIndex: 1 }}>
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

      <Grid container spacing={2} sx={{ height: "32vh", justifyContent: "center", alignItems: "flex-end", zIndex: 1 }}>
        <Grid item xs={4}>
          <img src={Astronaut} style={{ height: "20vh", width: "10vw" }} alt="Astronaut" />
        </Grid>
        <CustomButton text="START" onClick={() => navigate("/")} />
        <Grid item xs={4}>
          <img src={Scientist} style={{ height: "20vh", width: "10vw" }} alt="Astronaut" />
        </Grid>
      </Grid>
    </Space>
  );
};

export default Landing;
