import { Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { RoomName } from "../../components";
import { useQueryRoom } from "../../hooks/useQueryRoom";
import { useSubscribeRoom } from "../../hooks/useSubscribeRoom";
import useStore from "../../store";

export default function Room() {
  const router = useRouter();
  const { roomId } = router.query;

  const session = useStore((state) => state.session);
  const { data: rooms } = useQueryRoom();
  console.log({ rooms });
  useSubscribeRoom();

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <>
      <Stack alignItems="center">
        <RoomName />
        <Typography variant="body1" sx={{ p: 3 }}>
          {rooms ? rooms[0].name : "No room"}
        </Typography>
        <Button style={{ width: 20 }} variant="contained" onClick={handleClick}>
          Exit
        </Button>
      </Stack>
    </>
  );
}
