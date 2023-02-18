import * as React from "react";
import { Dialog, DialogContent } from "@mui/material";
// import { ReactComponent as SettingsWheel } from "../assets/SettingsWheel.svg";

interface SettingsProps {
  open: boolean;
  handleClose: () => void;
}

const SettingsDialog = ({ open, handleClose }: SettingsProps) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>Settings</DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
