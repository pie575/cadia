import * as React from "react";
import { Modal, Grid, IconButton, Typography } from "@mui/material";
import RecieveImagePicture from "../../assets/Game/RecieveImage.svg";
import SendImagePicture from "../../assets/Game/SendImage.svg";
import CloseButton from "../../assets/CloseButton.svg";
import PokerTableImage from "../../assets/pokertable.svg";

interface ChatDialogProps {
  open: boolean;
  handleClose: () => void;
  messageData: Message[];
}
export interface Message {
  message: string;
  sent: boolean;
}
interface MessageProps {
  message: string;
}

const SentMessage = ({ message }: MessageProps) => {
  return (
    <Grid
      container
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        width: "auto",
      }}
    >
      <Grid
        item
        sx={{
          position: "relative",
          backgroundSize: "100% 100%",
          backgroundImage: `url(${SendImagePicture})`,
          backgroundPosition: "center",
          borderRadius: "5px",
          padding: "35px 35px 60px 35px",
          marginBottom: "1.5vh",
        }}
      >
        <Typography sx={{ fontFamily: "Joystix", fontSize: ".9rem", color: "white", display: "inline-block" }}>
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
};
const RecieveMessage = ({ message }: MessageProps) => {
  return (
    <Grid
      container
      sx={{
        width: "auto",
      }}
    >
      <Grid
        item
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          backgroundSize: "100% 100%",
          backgroundImage: `url(${RecieveImagePicture})`,
          backgroundPosition: "center",
          borderRadius: "5px",
          padding: "15px",
          marginBottom: "1.5vh",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Joystix",
            fontSize: "1.1rem",
            color: "#402f5c",
            display: "inline-block",
            paddingLeft: "10px",
          }}
        >
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
};

const MessageComponent = ({ message, sent }: Message) => {
  return sent ? <SentMessage message={message} /> : <RecieveMessage message={message} />;
};

const ChatDialog = ({ open, handleClose, messageData }: ChatDialogProps) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Grid
        container
        sx={{
          width: "100vw",
          justifyContent: "center",
          outline: 0,
        }}
      >
        <Grid item sx={{ width: "80vw", height: "90vh", position: "fixed", left: "10vw", top: "5vh", zIndex: "-1" }}>
          <img src={PokerTableImage} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </Grid>
        <Grid item sx={{ position: "absolute", right: "1vw", top: "1vh" }}>
          <IconButton onClick={handleClose}>
            <img src={CloseButton} alt="Settings Button" style={{ width: "3vw" }} />
          </IconButton>
        </Grid>

        <Grid container sx={{ marginTop: "10vh" }}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginBottom: "5vh" }}>
            <Typography sx={{ fontFamily: "Joystix", fontSize: "1.5rem", color: "white" }}>Messages</Typography>
          </Grid>
        </Grid>
        <Grid item sx={{ display: "flex", flexDirection: "column", overflow: "scroll", width: "60vw", height: "60vh" }}>
          {messageData?.map((message) => {
            return <MessageComponent message={message.message} sent={message.sent} />;
          })}
        </Grid>
      </Grid>
    </Modal>
  );
};

export default ChatDialog;
