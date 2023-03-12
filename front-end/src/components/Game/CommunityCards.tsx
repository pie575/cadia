import * as React from "react";
import { Grid } from "@mui/material";
import CardEntity from "../../assets/cards/CardEntity";

type CommunityCardsProps = {
  communityCards: string[];
};

const CommunityCards = ({ communityCards }: CommunityCardsProps) => {
  return (
    <div>
      <Grid container className="community-cards" sx={{ height: "20vh" }}>
        <CardEntity card={communityCards[0]} />
        <CardEntity card={communityCards[1]} />
        <CardEntity card={communityCards[2]} />
      </Grid>
      <Grid container className="community-cards" sx={{ height: "20vh" }}>
        <CardEntity card={communityCards[3]} />
        <CardEntity card={communityCards[4]} />
      </Grid>
    </div>
  );
};

export default CommunityCards;
