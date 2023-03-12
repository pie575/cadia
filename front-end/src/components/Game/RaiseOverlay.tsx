import * as React from "react";
import { Grid, IconButton, Modal } from "@mui/material";
import Slide from "@mui/material/Slide";
import Space from "../../assets/Space/Space.svg";
import GameButton from "./GameButton";
import CloseButton from "../../assets/Game/CloseButton.svg";
// import { gameState } from "../../Game/containers/GameLay";

interface RaiseOverlayProps {
  open: boolean;
  userBalance: number;
  handleRaise: (index: number, amountRaise: number) => void;
  handleClose: () => void;
  gameState: any;
}

const RaiseOverlay = ({ open, userBalance, handleRaise, handleClose, gameState }: RaiseOverlayProps) => {
  const [betAmount, setBetAmount] = React.useState<number>(0);

  const changeBetAmount = (newBetAmount: number) => {
    let changedBet = newBetAmount;
    if (newBetAmount > userBalance) changedBet = userBalance;
    if (newBetAmount < 0) changedBet = 0;
    setBetAmount(changedBet);
  };

  const placeBet = () => {
    const maxCurrentBet = gameState.round
      .slice(0)
      .sort((a: { current_bet: number }, b: { current_bet: number }) => b.current_bet - a.current_bet)[0].current_bet;
    if (betAmount < maxCurrentBet) return; /* cannot raise below the maximum current bet for this round */
    if (betAmount <= userBalance) handleRaise(0, betAmount);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Slide in={open} direction="up">
        <Grid
          container
          sx={{
            backgroundImage: `url(${Space})`,
            height: "30vh",
            width: "100vw",
            display: "flex",
            alignContent: "center",
            position: "absolute",
            bottom: 0,
            opacity: "90%",
          }}
        >
          <Grid container sx={{ margin: "0 17vw 5vh 17vw", width: "80vw", display: "flex", justifyContent: "center" }}>
            <Grid item xs={3} sx={{ display: "flex", justifyContent: "flex-start" }}>
              <GameButton text="Add 10" onClick={() => changeBetAmount(betAmount + 10)} />
            </Grid>
            <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}>
              <GameButton text="Add 50" onClick={() => changeBetAmount(betAmount + 50)} />
            </Grid>
            <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}>
              <GameButton text={`Place ${betAmount}`} onClick={() => placeBet()} />
            </Grid>
            <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}>
              <IconButton
                onClick={() => {
                  handleClose();
                  changeBetAmount(0);
                }}
              >
                <img src={CloseButton} alt="Close" style={{ width: "10vw", height: "12vh" }} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Slide>
    </Modal>
  );
};

export default RaiseOverlay;
