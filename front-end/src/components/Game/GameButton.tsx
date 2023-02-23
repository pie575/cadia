import * as React from "react";
import { Button, Grid } from "@mui/material";
import GameBaseButton from "../../assets/Game/GameBaseButton.svg";
import MaskedText from "../MaskedText";

interface GameButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const GameButton = ({ text, onClick, disabled }: GameButtonProps) => {
  return (
    <Grid item sx={{ margin: "auto" }}>
      <Button
        onClick={onClick}
        sx={{
          backgroundImage: `url(${GameBaseButton})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "15vw",
          height: "12vh",
          opacity: disabled ? "50%" : "100%",
          cursor: disabled ? "default" : "pointer",
        }}
        disabled={disabled}
      >
        <MaskedText text={text} fontSize="1.75rem" />
      </Button>
    </Grid>
  );
};

export default GameButton;
