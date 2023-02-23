import * as React from "react";
import { Grid } from "@mui/material";
import CardEntity from "../../assets/cards/CardEntity";
import "../../styles/game.css";

const UserCards = () => {
  // const CurrCards = GameState.useState();
  return (
    <div>
      <CardEntity className="player-card-1" card="3h" />
      <CardEntity className="player-card-2" card="3c" />
    </div>
  );
};

export default UserCards;
