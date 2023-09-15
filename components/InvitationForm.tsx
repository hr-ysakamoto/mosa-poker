import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { SignOutButton } from "./SignOutButton";

interface InvitationFormProps {
  roomId?: string;
  onClick: (e: any) => void;
}
export const InvitationForm = ({ roomId, onClick }: InvitationFormProps) => {
  return (
    <>
      <Typography variant="body1">Room ID: {roomId}</Typography>
      <Stack sx={{ m: 3 }} direction="row" spacing={2} justifyContent="center">
        <Button
          variant="contained"
          size="large"
          onClick={onClick}
          disabled={!roomId}
          startIcon={<LoginIcon />}
        >
          JOIN
        </Button>
        <SignOutButton />
      </Stack>
    </>
  );
};
