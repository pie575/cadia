import * as React from "react";
import { Button, Grid, Typography } from "@mui/material";
import MaskedText from "../components/MaskedText";

const Contact = () => {
  return (
    <Grid container sx={{ justifyContent: "center" }}>
      <Grid item xs={12}>
        <MaskedText text="Contact Us" fontSize="4rem" />
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "white" }}>Feel free to contact us below</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ color: "white" }}>Or check out our OpenFund</Typography>
        <Button onClick={() => window.location.replace("https://openfund.com/d/DeSoCade?invite=XTMhK24k")}>
          OpenFund
        </Button>
      </Grid>
      {/* https://openfund.com/d/DeSoCade?invite=XTMhK24k */}
    </Grid>
  );
};

export default Contact;
