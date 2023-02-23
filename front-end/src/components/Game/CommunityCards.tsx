import * as React from "react";
import { Grid } from "@mui/material";
import CardEntity from "../../assets/cards/CardEntity";

const CommunityCards = () => {
  // const CurrCards = GameState.useState();
  return (
    <div>
      <Grid container className="community-cards" sx={{ height: "20vh" }}>
        <CardEntity card="3h" />
        <CardEntity card="3c" />
        <CardEntity card="3c" />
      </Grid>
      <Grid container className="community-cards" sx={{ height: "20vh" }}>
        <CardEntity card="3h" />
        <CardEntity card="3c" />
      </Grid>
    </div>
  );
};

export default CommunityCards;
