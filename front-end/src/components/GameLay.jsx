import * as React from "react";
import { Box, Button, Container, Grid, IconButton, SvgIcon, Typography } from "@mui/material";
// eslint-disable-next-line import/no-extraneous-dependencies
import SettingsIcon from "@mui/icons-material/Settings";
// eslint-disable-next-line import/no-extraneous-dependencies
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useNavigate } from "react-router-dom";
import "../styles/game.css";
import FoldButton from "../assets/foldbutton.svg";
import PokerTableImage from "../assets/pokertable.svg";
import Cards from "../assets/cards/cards";
import GoldPotImg from "../assets/goldpot.svg";
import CoinImg from "../assets/coin.svg";
import GameState from "../engine"
const GameLay = () => {
  const Option  = (props) => {
    return (
      <Button>
        <div class="option">
        <img
          src={FoldButton}
          alt=""
        />
      </div>
      </Button>
    );
  }

  const CommunityCards = () => {
    const CurrCards = GameState;
    const Card1 = Cards[0][0];
    const Card2 = Cards[0][1];
    return (
      <div className="community-cards">
        <Card1 />
        <Card2 />
        <Card1 />
        <Card1 />
        <Card1 />
      </div>
    );
  }
  const PokerTable = () => {
    return (
      <div>
        <div class="table-cards">
        <div class="table-div">
          <img
            src={PokerTableImage}
            width="100"
            alt=""
            class="poker-table-img"
          />
        </div>
          <div class="actual-table">
            <div class="side">
              <div class="bet">
                <img
                  src={CoinImg}
                  alt=""
                />
                <Typography
                  sx={{
                    fontFamily: "Joystix",
                    fontSize: "2.5rem",
                    textShadow: "0px 4px 0px #5D0A9D",
                    color: "white",
                  }}
                >
                  100
                </Typography>
              </div>
              <div class="gpt-bame">
                <Typography
                  sx={{
                    fontFamily: "Joystix",
                    fontSize: "2.5rem",
                    textShadow: "0px 4px 0px #5D0A9D",
                    color: "white",
                  }}
                >
                  ChatGPT
                </Typography>
              </div>
              <div class="div-block-2"></div>
            </div>
            <div class="center-cards">
              <CommunityCards />
            </div>
            
            <div class="player-side">
              <div class="side">
                <div class="bet">
                  <img
                    src={CoinImg}
                    alt=""
                  />
                  <Typography
                  sx={{
                    fontFamily: "Joystix",
                    fontSize: "2.5rem",
                    textShadow: "0px 4px 0px #5D0A9D",
                    color: "white",
                  }}
                >
                  100
                </Typography>
                </div>
                <div class="gpt-bame">
                <Typography
                  sx={{
                    fontFamily: "Joystix",
                    fontSize: "2.5rem",
                    textShadow: "0px 4px 0px #5D0A9D",
                    color: "white",
                  }}
                >
                  Player
                </Typography>
                </div>
                <div class="div-block-2">
                  <img
                    src={GoldPotImg}
                    alt=""
                  />
                </div>
              </div>
              <div class="player-options">
              <Option/>
              <Option/>
              <Option/>
              <Option/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
      <PokerTable />
  );
};

export default GameLay;
