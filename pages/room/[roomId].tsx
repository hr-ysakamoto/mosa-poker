import { Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { RoomName } from "../../components";
import { useQueryRoom } from "../../hooks/useQueryRoom";
import { useSubscribeRoom } from "../../hooks/useSubscribeRoom";

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
      <RoomName />
      <Typography variant="body1" sx={{ p: 3 }}>
        {!room ? "No room" : room.name}
      </Typography>
      <Button style={{ width: 20 }} variant="contained" onClick={handleClick}>
        Exit
      </Button>
    </Stack>
  );
}
