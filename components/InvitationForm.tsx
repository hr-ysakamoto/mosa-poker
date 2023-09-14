import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { SignOutButton } from "./SignOutButton";

interface InvitationFormProps {
  roomId?: string;
  onClick: (e: any) => void;
}
export const InvitationForm = ({ roomId, onClick }: InvitationFormProps) => {
  return (
    <>
      <Typography variant="body1">Room ID: {roomId}</Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="contained"
          size="large"
          onClick={onClick}
          disabled={!roomId}
        >
          JOIN
        </Button>
        <SignOutButton />
      </Stack>
    </>
  );
};
