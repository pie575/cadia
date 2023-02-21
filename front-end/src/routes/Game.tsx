import * as React from "react";
import { Box, Button, Container, Grid, IconButton, SvgIcon, Typography } from "@mui/material";
// eslint-disable-next-line import/no-extraneous-dependencies
import SettingsIcon from "@mui/icons-material/Settings";
// eslint-disable-next-line import/no-extraneous-dependencies
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useNavigate } from "react-router-dom";
import SettingsDialog from "../components/SettingsDialog";
import SettingsWheel from "../assets/SettingsWheel.svg";
import GameLay from "../components/GameLay";
import background from "../assets/background.svg";

const Game = () => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const BackGroundStyle = { backgroundImage: `url(${background})` };

  return (
    <div style={BackGroundStyle}>
      <GameLay />
    </div>
  );
};

export default Game;
