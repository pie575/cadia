import * as React from "react";
import { Grid, Typography, IconButton } from "@mui/material";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useNavigate } from "react-router-dom";
import { identity } from "@deso-core/identity";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { getDisplayName } from "../helpers";
import Space from "../containers/Space";
import Rules from "../assets/Home/Rules.svg";
import CustomButton from "../components/CustomButton";
import { UserContext } from "../contexts";

const Home = () => {
  const navigate = useNavigate();
  // add isLoading later
  const { currentUser } = React.useContext(UserContext);

  return (
    <Space>
      <Grid container>
        <Grid container sx={{ alignItems: "center", justifyContent: "right" }}>
          <Grid item>
            {currentUser && <Typography sx={{ fontFamily: "Joystix" }}>{getDisplayName(currentUser)}</Typography>}
          </Grid>
          <Grid item sx={{ margin: "0 10px" }}>
            {currentUser ? (
              <IconButton onClick={() => identity.logout()} size="large">
                <LogoutIcon sx={{ fontSize: "2.5rem", color: "white" }} />
              </IconButton>
            ) : (
              <IconButton onClick={() => identity.login()} size="large">
                <LoginIcon sx={{ fontSize: "2.5rem", color: "white" }} />
              </IconButton>
            )}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography sx={{ fontFamily: "Joystix", fontSize: "1.5rem" }}>A virtual arcade</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            backgroundImage: `url(${Rules})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "60vw",
            height: "50vh",
            margin: "20px",
          }}
        />
        <CustomButton text="START" onClick={() => navigate("/game")} />
      </Grid>
    </Space>
  );
};

export default Home;
