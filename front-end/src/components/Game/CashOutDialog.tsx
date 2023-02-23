import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, IconButton, Modal, Typography } from "@mui/material";
import Slide from "@mui/material/Slide";
import ConfirmCashOut from "../../assets/Game/ConfirmCashOut.svg";
import ExitCashOut from "../../assets/Game/ExitCashOut.svg";

interface CashOutDialogProps {
  open: boolean;
  handleClose: () => void;
}

const CashOutDialog = ({ open, handleClose }: CashOutDialogProps) => {
  const navigate = useNavigate();

  const confirmCashOut = () => {
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
              You are about to cash out your coins for a score. your score will be recorded, but you will not able to
              continue playing with your coins. are you sure?
            </Typography>
          </Grid>
          <Grid item flexGrow={1} />
          <Grid item xs={2}>
            <IconButton onClick={confirmCashOut}>
              <img src={ConfirmCashOut} alt="Confirm cash out" style={{ width: "4vw" }} />
            </IconButton>
          </Grid>
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
