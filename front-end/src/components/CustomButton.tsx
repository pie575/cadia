import * as React from "react";
import { Button, Grid } from "@mui/material";
import BaseButton from "../assets/BaseButton.svg";
import MaskedText from "./MaskedText";

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
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "15vw",
          height: "20vh",
        }}
      >
        <MaskedText text={text} fontSize="1.25rem" />
      </Button>
    </Grid>
  );
};

export default CustomButton;
