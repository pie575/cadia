import * as React from "react";
import { Grid } from "@mui/material";
import Cards from "../../assets/cards/cards";

const CommunityCards = () => {
  // const CurrCards = GameState.useState();
  const Card1 = Cards[0][0];
  const Card2 = Cards[0][1];
  return (
    <Grid container className="community-cards" sx={{ height: "40vh" }}>
      <Card1 />
      <Card2 />
    </Grid>
  );
};

export default CommunityCards;
