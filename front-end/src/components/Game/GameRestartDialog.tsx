import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, IconButton, Modal, Typography } from "@mui/material";
import Slide from "@mui/material/Slide";
import ConfirmRestart from "../../assets/Game/ConfirmRestart.svg";
import ExitRestart from "../../assets/Game/ExitRestart.svg";
import { pushLeaderboardData } from "../../utils/APIConnection";
import { UserContext } from "../../contexts";

interface GameRestartDialogProps {
  open: boolean;
  userScore: number;
  handleClose: () => void;
}

const GameRestartDialog = ({ open, userScore, handleClose }: GameRestartDialogProps) => {
  const navigate = useNavigate();
  const { currentUser } = React.useContext(UserContext);

  const confirmRestart = () => {
    if (currentUser) return;
    // pushLeaderboardData({
    //   name: currentUser.ProfileEntryResponse.Username,
    //   score: userScore,
    //   walletId: currentUser.PublicKeyBase58Check,
    // });
    navigate("/home");
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Slide in={open} direction="left">
        <Grid
          container
          sx={{
            backgroundColor: "#402F5C",
            width: "60vw",
            height: "20vh",
            position: "absolute",
            right: 0,
            alignItems: "center",
          }}
        >
          <Grid item xs={7} sx={{ marginLeft: "1vw" }}>
            <Typography sx={{ fontFamily: "Joystix", color: "white" }}>
              You are about to restart the game with 100 coin. your score will be recorded, but you will not able to
              continue playing with your coins. are you sure?
            </Typography>
          </Grid>
          <Grid item flexGrow={1} />
          <Grid item xs={2}>
            <IconButton onClick={confirmRestart}>
              <img src={ConfirmRestart} alt="Confirm Restart" style={{ width: "4vw" }} />
            </IconButton>
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={handleClose}>
              <img src={ExitRestart} alt="Cancel Restart" style={{ width: "4vw" }} />
            </IconButton>
          </Grid>
        </Grid>
      </Slide>
    </Modal>
  );
};

export default GameRestartDialog;
