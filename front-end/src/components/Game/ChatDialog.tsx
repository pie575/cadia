import * as React from "react";
import { Dialog, DialogContent, Grid, IconButton, Typography } from "@mui/material";
import LeaderboardTable from "../../assets/LeaderboardTable.svg";
import RecieveImagePicture from "../../assets/Game/RecieveImage.svg";
import SendImagePicture from "../../assets/Game/SendImage.svg";
import CloseButton from "../../assets/CloseButton.svg";

interface ChatDialogProps {
  open: boolean;
  handleClose: () => void;
}
interface Message {
  message: string;
  sent: boolean;
}
interface MessageProps {
  messageObj: Message;
}

const SentMessage = (message: string) => {
  return (
    <Grid
      container
      sx={{
        width: "30vw",
      }}
    >
      <Grid item xs={4} />
      <Grid
        item
        xs={8}
        sx={{
          backgroundImage: `url(${SendImagePicture})`,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontFamily: "Joystix", fontSize: "1.1rem", color: "white" }}>{message}</Typography>
      </Grid>
    </Grid>
  );
};

const RecieveMessage = (message: string) => {
  return (
    <Grid
      container
      sx={{
        width: "30vw",
      }}
    >
      <Grid
        item
        xs={8}
        sx={{
          backgroundImage: `url(${RecieveImagePicture})`,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontFamily: "Joystix", fontSize: "1.1rem", color: "white" }}>{message}</Typography>
      </Grid>
      <Grid item xs={4} />
    </Grid>
  );
};
const MessageComponent = (props: MessageProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  return props.messageObj.sent ? (
    <SentMessage message={props.messageObj.message} />
  ) : (
    <RecieveMessage message={props.messageObj.message} />
  );
};

const ChatDialog = ({ open, handleClose }: ChatDialogProps) => {
  const [messageData, setMessageData] = React.useState<Message[]>();

  React.useEffect(() => {
    // const prompts = getLeaderboardData(10);
    const sentMessages = [
      { message: "Send Message 1.", sent: true },
      { message: "Recieve Message 1.", sent: false },
      { message: "Send Message 2.", sent: true },
      { message: "Recieve Message 1.", sent: false },
      { message: "Send Message 3.", sent: true },
    ];
    setMessageData(sentMessages);
  }, []);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={{ backgroundColor: "black", width: "30vw", height: "50vh" }}>
        <Grid
          container
          sx={{
            backgroundImage: `url(${LeaderboardTable})`,
            backgroundSize: "100% 100%",
            height: "50vh",
            width: "30vw",
          }}
        >
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
          <Grid container sx={{ margin: "2vw" }}>
            {messageData?.map((message) => {
              return <MessageComponent messageObj={message} />;
            })}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
