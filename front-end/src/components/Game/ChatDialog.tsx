import * as React from "react";
import { Modal, Grid, IconButton, Typography } from "@mui/material";
import LeaderboardTable from "../../assets/LeaderboardTable.svg";
import RecieveImagePicture from "../../assets/Game/RecieveImage.svg";
import SendImagePicture from "../../assets/Game/SendImage.svg";
import CloseButton from "../../assets/CloseButton.svg";
import PokerTableImage from "../../assets/pokertable.svg";

interface ChatDialogProps {
  open: boolean;
  handleClose: () => void;
}
interface Message {
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
        width: "auto",
      }}
    >
      <Grid
        item
        xs="auto"
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          backgroundSize: "100% 100%",
          backgroundImage: `url(${SendImagePicture})`,
          backgroundPosition: "center",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        <Typography sx={{ fontFamily: "Joystix", fontSize: "1.1rem", color: "white", display: "inline-block" }}>
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
        xs="auto"
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          backgroundSize: "100% 100%",
          backgroundImage: `url(${RecieveImagePicture})`,
          backgroundPosition: "center",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        <Typography sx={{ fontFamily: "Joystix", fontSize: "1.1rem", color: "purple", display: "inline-block" }}>
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
};

const MessageComponent = ({ message, sent }: Message) => {
  return sent ? <SentMessage message={message} /> : <RecieveMessage message={message} />;
};

const ChatDialog = ({ open, handleClose }: ChatDialogProps) => {
  const [messageData, setMessageData] = React.useState<Message[]>();

  React.useEffect(() => {
    // const prompts = getLeaderboardData(10);
    const sentMessages = [
      { message: "Send Messoijasdoijasdoijasodijage 1.", sent: true },
      { message: "Recieve Message 1.", sent: false },
      { message: "Send Message 2.", sent: true },
      { message: "Recieve Message 1.", sent: false },
      { message: "Send Message 3.", sent: true },
    ];
    setMessageData(sentMessages);
  }, []);

  return (
    <Modal open={open} onClose={handleClose}>
      <Grid
        container
        sx={{
          width: "100vw",
          height: "100vh",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item sx={{ width: "80vw", height: "90vh", position: "fixed", left: "10vw", top: "5vh", zIndex: "-1" }}>
          <img src={PokerTableImage} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </Grid>

        <Grid container sx={{ marginTop: "2vh" }}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={{ fontFamily: "Joystix", fontSize: "1.5rem", color: "white" }}>Messages</Typography>
          </Grid>
          <Grid item sx={{ position: "absolute", right: "1vw", top: "1vh" }}>
            <IconButton onClick={handleClose}>
              <img src={CloseButton} alt="Settings Button" style={{ width: "3vw" }} />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item sx={{ display: "flex", flexDirection: "column", overflow: "scroll", width: "70vw" }}>
          {messageData?.map((message) => {
            return <MessageComponent message={message.message} sent={message.sent} />;
          })}
        </Grid>
      </Grid>
    </Modal>
  );
};

export default ChatDialog;
