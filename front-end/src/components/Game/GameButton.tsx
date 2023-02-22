import * as React from "react";
import { Button, Grid } from "@mui/material";
import GameBaseButton from "../../assets/Game/GameBaseButton.svg";
import MaskedText from "../MaskedText";

interface GameButtonProps {
  text: string;
  onClick: () => void;
}

const GameButton = ({ text, onClick }: GameButtonProps) => {
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
};

export default GameButton;
