import * as React from "react";
import { Button, Grid, IconButton } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { useNavigate } from "react-router-dom";
import SettingsDialog from "../components/SettingsDialog";
import SettingsWheel from "../assets/SettingsWheel.svg";
import GameLay from "../containers/GameLay";
import Space from "../assets/Space/Space.svg";
import MaskedText from "../components/MaskedText";

const Game = () => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <div>
      <Grid sx={{ backgroundImage: `url(${Space})` }}>
        <Grid container sx={{ alignContent: "center", alignItems: "center" }}>
          <Grid item xs={6} sx={{ display: "flex", justifyContent: "start" }}>
            <Button onClick={() => navigate("/home")}>
              <KeyboardArrowLeftIcon fontSize="large" sx={{ color: "white" }} />
              <MaskedText text="Back" fontSize="1rem" />
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ display: "flex", justifyContent: "end" }}>
            <IconButton aria-label="Settings" onClick={() => setSettingsOpen(true)}>
              <img src={SettingsWheel} alt="Settings Button" style={{ width: "3vw" }} />
            </IconButton>
          </Grid>
        </Grid>
        <SettingsDialog open={settingsOpen} handleClose={() => setSettingsOpen(false)} />
      </Grid>
      <GameLay />
    </div>
  );
};

export default Game;
