import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Button, Stack, Typography } from "@mui/material";
import useStore from "../../store";
import { useQueryRoom } from "../../hooks/useQueryRoom";
import { useSubscribeRoom } from "../../hooks/useSubscribeRoom";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "../../utils/supabase";
import { CardSlot, Hand } from "../../components";

export default function Room() {
  const router = useRouter();
  const user = useUser();
  const session = useStore((state) => state.session);
  useEffect(() => {
    if (!session) {
      router.replace("/");
    }
  }, [session, router]);
  console.log({ user });

  const { roomId } = router.query;
  const { data: room } = useQueryRoom();
  console.log({ room });
  useSubscribeRoom();

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push("/");
  };

  const signOut = () => {
    supabase.auth.signOut();
    router.push("/");
  };

  const fibos = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  // const emojis = ["😰", "😞", "😐", "😀", "😊"];
  const users = ["Taro", "Jiro", "Saburo", "Shiro"];

  return (
    <Stack alignItems="center">
      <Typography variant="body1">Room ID: {roomId}</Typography>
      <Typography variant="h5">{!room ? "No room" : room.name}</Typography>
      <Button onClick={signOut}>Log Out</Button>
      <Stack sx={{ p: 3 }} spacing={2} direction="row" justifyContent="center">
        <Button variant="outlined">reveal</Button>
        <Button variant="outlined">reset</Button>
      </Stack>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="center">
          {users.map((user) => (
            <CardSlot key={user} state="up" value={"😊"} />
          ))}
        </Stack>
      </Box>
      <Typography variant="h5" align="center">
        Select a card
      </Typography>
      <Stack sx={{ p: 3 }} direction="row" justifyContent="center">
        {fibos.map((value) => (
          <Hand key={value} value={value.toString()} />
        ))}
      </Stack>
      <Button style={{ width: 20 }} variant="contained" onClick={handleClick}>
        Exit
      </Button>
    </Stack>
  );
}
