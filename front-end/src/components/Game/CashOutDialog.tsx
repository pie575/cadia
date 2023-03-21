import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, IconButton, Modal, Typography } from "@mui/material";
import Slide from "@mui/material/Slide";
import ConfirmCashOut from "../../assets/Game/ConfirmCashOut.svg";
import ExitCashOut from "../../assets/Game/ExitCashOut.svg";
import { pushLeaderboardData } from "../../utils/APIConnection";
import { UserContext } from "../../contexts";

interface CashOutDialogProps {
  open: boolean;
  userScore: number;
  handleClose: () => void;
  resetGameState: (arg0: boolean) => void;
}

const CashOutDialog = ({ open, userScore, handleClose, resetGameState }: CashOutDialogProps) => {
  const navigate = useNavigate();
  const { currentUser } = React.useContext(UserContext);

  const SubmitAndExit = () => {
    if (!currentUser) return;
    pushLeaderboardData({
      // temporary fix by using bracket notation w/ rule disabling to avoid errors because currentUser
      // is of type "never" due to the deso guy's code

      // eslint-disable-next-line @typescript-eslint/dot-notation
      name: currentUser["ProfileEntryResponse"]["Username"],
      score: userScore,
      // eslint-disable-next-line @typescript-eslint/dot-notation
      walletId: currentUser["PublicKeyBase58Check"],
    });
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
              You are about to submit your score. your score will be recorded, but you will not able to continue playing
              with your coins. are you sure?
            </Typography>
          </Grid>
          <Grid item flexGrow={1} />
          {/* need to change icons to represent two clicks */}
          <Grid item xs={2}>
            <IconButton onClick={SubmitAndExit}>
              <img src={ConfirmCashOut} alt="Submit Score and Exit" style={{ width: "4vw" }} />
            </IconButton>
          </Grid>
          {/* <Grid item xs={2}>
            <IconButton onClick={SubmitandRestart}>
              <img src={ConfirmCashOut} alt="Submit Score and Restart" style={{ width: "4vw" }} />
            </IconButton>
          </Grid> */}
          <Grid item xs={2}>
            <IconButton onClick={handleClose}>
              <img src={ExitCashOut} alt="Cancel cash out" style={{ width: "4vw" }} />
            </IconButton>
          </Grid>
        </Grid>
      </Slide>
    </Modal>
  );
};

export default CashOutDialog;
