import * as React from "react";
import { Grid } from "@mui/material";
import CardEntity from "../../assets/cards/CardEntity";

const CommunityCards = () => {
  // const CurrCards = GameState.useState();
  return (
    <Grid container className="community-cards" sx={{ height: "40vh" }}>
      <CardEntity card="3h" />
      <CardEntity card="3c" />
      <CardEntity card="3c" />
      <CardEntity card="3c" />
      <CardEntity back="false" card="3c" />
    </Grid>
  );
};

export default CommunityCards;
