import * as React from "react";
import { Button, Grid, IconButton, Modal } from "@mui/material";
import Slide from "@mui/material/Slide";
import Space from "../../assets/Space/Space.svg";
import CloseButton from "../../assets/Game/CloseButton.svg";
import GameBaseButton from "../../assets/buttonbacklong.svg";
import MaskedText from "../MaskedText";

interface GameButtonProps {
  text: string;
  onClick: () => void;
}

const ChatGPTMessage = ({ text, onClick }: GameButtonProps) => {
  return (
    <Grid item sx={{ margin: "auto" }}>
      <Button
        onClick={onClick}
        sx={{
          backgroundImage: `url(${GameBaseButton})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "45vw",
          height: "12vh",
          opacity: "100%",
          cursor: "default",
        }}
      >
        <MaskedText text={text} fontSize="1.75rem" />
      </Button>
    </Grid>
  );
};

interface RaiseOverlayProps {
  open: boolean;
  handleClose: () => void;
}

const ChatGPTUpdate = ({ open, handleClose }: RaiseOverlayProps) => {
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
            <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start" }}>
              <ChatGPTMessage text="ChatGPT has ____." onClick={() => {}} />
            </Grid>
            <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}>
              <IconButton
                onClick={() => {
                  handleClose();
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

export default ChatGPTUpdate;
