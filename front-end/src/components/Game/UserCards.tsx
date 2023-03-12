import * as React from "react";
import { Grid } from "@mui/material";
import CardEntity from "../../assets/cards/CardEntity";
import "../../styles/game.css";

type UserCardsProps = {
  userCards: string[];
};

const UserCards = ({ userCards }: UserCardsProps) => {
  if (userCards.length !== 2) {
    return <div />;
  }
  return (
    <div>
      <CardEntity className="player-card-1" card={userCards[0]} />
      <CardEntity className="player-card-2" card={userCards[1]} />
    </div>
  );
};

export default UserCards;
