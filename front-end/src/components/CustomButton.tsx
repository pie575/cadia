import * as React from "react";
import { Button, Grid, Typography } from "@mui/material";
import BaseButton from "../assets/BaseButton.svg";

interface CustomButtonProps {
  text: string;
  onClick: () => void;
}

const CustomButton = ({ text, onClick }: CustomButtonProps) => {
  return (
    <Grid item xs={4} sx={{ margin: "auto" }}>
      <Button
        onClick={onClick}
        sx={{
          backgroundImage: `url(${BaseButton})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "12vw",
          height: "12vh",
        }}
      >
        <Typography sx={{ fontFamily: "Joystix", fontSize: "1.25rem" }}>{text}</Typography>
      </Button>
    </Grid>
  );
};

export default CustomButton;
