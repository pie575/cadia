import * as React from "react";
import { Box, Typography } from "@mui/material";

interface MaskedTextProps {
  text: string;
  fontSize?: string;
  // if true, adds a shadow to the text instead of an outline
  shadow?: boolean;
}

const MaskedText = ({ text, fontSize, shadow }: MaskedTextProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Typography
        sx={{
          fontFamily: "Joystix",
          fontSize: fontSize ?? "1.75rem",
          position: "absolute",
          color: "white",
          background: "linear-gradient(to top, #EB9BD5, #EB9BD5 50%, white 20%, white 100%);",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          zIndex: 1,
        }}
      >
        {text}
      </Typography>
      <Typography
        sx={{
          fontFamily: "Joystix",
          fontSize: fontSize ?? "1.75rem",
          textShadow: shadow ? "0px 4px 0px #5D0A9D" : "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default MaskedText;
