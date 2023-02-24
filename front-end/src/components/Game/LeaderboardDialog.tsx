import * as React from "react";
import { Dialog, DialogContent, Grid, IconButton, Typography } from "@mui/material";
import LeaderboardTable from "../../assets/LeaderboardTable.svg";
import CloseButton from "../../assets/CloseButton.svg";
import { getChatGPTResponse, getLeaderboardData } from "../../utils/APIConnection";

interface LeaderboardDialogProps {
  open: boolean;
  handleClose: () => void;
}

interface LeaderboardData {
  displayName: string;
  score: number;
}

const createLeaderboardRank = (idx: number, data: LeaderboardData) => {
  return (
    <Grid item xs={12} key={idx + 1}>
      <Typography sx={{ fontFamily: "Joystix", color: "white" }}>
        {idx + 1}. {data.displayName} {data.score}
      </Typography>
    </Grid>
  );
};

const LeaderboardDialog = ({ open, handleClose }: LeaderboardDialogProps) => {
  const [leaderboardData, setLeaderboardData] = React.useState<LeaderboardData[]>();

  React.useEffect(() => {
    const data = getLeaderboardData(10);
    setLeaderboardData(data);
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
              <Typography sx={{ fontFamily: "Joystix", fontSize: "1.5rem", color: "white" }}>Leaderboard</Typography>
            </Grid>
            <Grid item sx={{ position: "absolute", right: "1vw", top: "1vh" }}>
              <IconButton onClick={handleClose}>
                <img src={CloseButton} alt="Settings Button" style={{ width: "3vw" }} />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container sx={{ margin: "2vw" }}>
            {leaderboardData?.map((data: LeaderboardData, idx: number) => createLeaderboardRank(idx, data))}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardDialog;
