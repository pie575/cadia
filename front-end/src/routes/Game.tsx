import * as React from "react";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
// eslint-disable-next-line import/no-extraneous-dependencies
// import SettingsIcon from "@mui/icons-material/Settings";
// eslint-disable-next-line import/no-extraneous-dependencies
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useNavigate } from "react-router-dom";
import SettingsDialog from "../components/SettingsDialog";
import SettingsWheel from "../assets/SettingsWheel.svg";

const Game = () => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center">
      <Grid container>
        <Grid item xs={6}>
          <Button onClick={() => navigate("/")}>
            <KeyboardArrowLeftIcon fontSize="large" />
            <Typography sx={{ fontFamily: "Joystix" }}>Back</Typography>
          </Button>
        </Grid>
        <Grid item xs={6}>
          <IconButton aria-label="Settings" onClick={() => setSettingsOpen(true)}>
            <img src={SettingsWheel} alt="Settings Button" />
          </IconButton>
        </Grid>
      </Grid>

      <Grid container sx={{ width: "80vw", height: "60vh", background: "#6368A1" }}>
        <Box />
      </Grid>
      <SettingsDialog open={settingsOpen} handleClose={() => setSettingsOpen(false)} />
    </Grid>
  );
};

export default Game;
