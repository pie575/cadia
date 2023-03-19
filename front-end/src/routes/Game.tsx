import * as React from "react";
import { Button, Grid, IconButton } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { useNavigate } from "react-router-dom";
import GameLay from "../containers/GameLay";
import Space from "../assets/Space/Space.svg";
// import SettingsWheel from "../assets/SettingsWheel.svg";
import MaskedText from "../components/MaskedText";
import LeaderboardDialog from "../components/Game/LeaderboardDialog";
import ChatDialog from "../components/Game/ChatDialog";
// import { messageData } from "../containers/GameLay";
// import GameEnd from "../components/Game/GameEnd";

const Game = () => {
  const navigate = useNavigate();
  const [leaderboardOpen, setLeaderboardOpen] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(true);
  const messageData = [
    {
      message: "Hello, ChatGPT",
      sent: true,
    },
    {
      message: "Hello, User",
      sent: false,
    },
  ];

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
          <Grid item xs={3} sx={{ display: "flex", justifyContent: "end" }}>
            <IconButton aria-label="Settings" onClick={() => setLeaderboardOpen(true)}>
              {/* <img src={SettingsWheel} alt="Settings Button" style={{ width: "3vw" }} /> */}
              <LeaderboardIcon fontSize="large" sx={{ color: "white" }} />
            </IconButton>
          </Grid>
          a
        </Grid>
        <LeaderboardDialog open={leaderboardOpen} handleClose={() => setLeaderboardOpen(false)} />
        <ChatDialog open={chatOpen} handleClose={() => setChatOpen(false)} messageData={messageData} />
      </Grid>
      <GameLay />
    </div>
  );
};

export default Game;
