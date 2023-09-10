import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { useQueryRoom } from "../../hooks/useQueryRoom";
import { useSubscribeRoom } from "../../hooks/useSubscribeRoom";
import { CardSlot, Hand } from "../../components";
import LogoutIcon from "@mui/icons-material/Logout";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CurtainsIcon from "@mui/icons-material/Curtains";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export default function Room() {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [roomId, setRoomId] = useState<string>("");

  const { data: rooms } = useQueryRoom();
  useSubscribeRoom();

  useEffect(() => {
    if (router.asPath !== router.route) {
      const roomId = String(router.query.roomId);
      setRoomId(roomId);
    }
  }, [rooms, router]);

  useEffect(() => {
    if (router.isReady && !user) {
      router.replace("/");
    }
  }, [router, user]);

  const handleExitClick = (e: any) => {
    e.preventDefault();
    router.push("/robby");
  };

  const handleSignOutClick = (e: any) => {
    e.preventDefault();
    supabase.auth.signOut();
    router.push("/");
  };

  const roomName = () => {
    return rooms?.find((room) => room.id === roomId)?.name || "";
  };

  const fibos = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  // const emojis = ["😰", "😞", "😐", "😀", "😊"];
  const users = ["Taro", "Jiro", "Saburo", "Shiro"];

  return (
    roomId && (
      <Stack alignItems="center">
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="body1">Room ID: {roomId}</Typography>
          <Button startIcon={<MeetingRoomIcon />} onClick={handleExitClick}>
            EXIT
          </Button>
          <Button
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={handleSignOutClick}
          >
            LOGOUT
          </Button>
        </Stack>
        <Typography sx={{ p: 2 }} variant="h4">
          {roomName()}
        </Typography>
        <Stack
          sx={{ p: 3 }}
          spacing={2}
          direction="row"
          justifyContent="center"
        >
          <Button variant="outlined" size="large" startIcon={<CurtainsIcon />}>
            REVEAL
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<RestartAltIcon />}
          >
            RESET
          </Button>
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
      </Stack>
    )
  );
}
