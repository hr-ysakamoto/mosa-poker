import React from "react";
import { useRouter } from "next/router";
import { Button, Stack, Typography } from "@mui/material";
import { useQueryRoom } from "../../hooks/useQueryRoom";
import { useSubscribeRoom } from "../../hooks/useSubscribeRoom";
import { Dashboard } from "../../components/Dashboard";

export default function Room() {
  const router = useRouter();
  const { roomId } = router.query;
  const { data: room } = useQueryRoom();
  useSubscribeRoom();

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <Stack alignItems="center">
      <Typography variant="body1">Room ID: {roomId}</Typography>
      <Typography variant="h4">{!room ? "No room" : room.name}</Typography>
      <Dashboard />
      <Button style={{ width: 20 }} variant="contained" onClick={handleClick}>
        Exit
      </Button>
    </Stack>
  );
}
