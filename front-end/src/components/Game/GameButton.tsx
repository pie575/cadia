import * as React from "react";
import { Button, Grid } from "@mui/material";
import GameBaseButton from "../../assets/Game/GameBaseButton.svg";
import MaskedText from "../MaskedText";

interface GameButtonProps {
  text: string;
  onClick: () => void;
  available: boolean;
}

const GameButton = ({ text, onClick, available }: GameButtonProps) => {
  if (available) {
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
          }}
        >
          <MaskedText text={text} fontSize="1.75rem" />
        </Button>
      </Grid>
    );
  }
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
          opacity: "50%",
          cursor: "default",
        }}
      >
        <MaskedText text={text} fontSize="1.75rem" />
      </Button>
    </Grid>
  );
};

export default GameButton;
