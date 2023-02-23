import * as React from "react";
import { Button } from "@mui/material";
import FoldButton from "../../assets/foldbutton.svg";

const Option = () => {
  return (
    <Button>
      <div className="option">
        <img src={FoldButton} alt="" />
      </div>
    </Button>
  );
};

export default Option;
