import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { Box, Button, Stack, Typography } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CurtainsIcon from "@mui/icons-material/Curtains";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useQueryRoom } from "../../hooks/useQueryRoom";
import { useQueryAdmission } from "../../hooks/useQueryAdmission";
import { useSubscribeRoom } from "../../hooks/useSubscribeRoom";
import { CardSlot, Hand } from "../../components";
import { SignOutButton } from "../../components/SignOutButton";
import { useMutateAdmission } from "../../hooks/useMutateAdmission";
import { useSubscribeAdmissions } from "../../hooks/useSubscribeAdmissions";

export default function Room() {
  const router = useRouter();
  const user = useUser();
  const [roomId, setRoomId] = useState<string>("");
  const { createAdmissionMutation, deleteAdmissionMutation } =
    useMutateAdmission();

  const { data: rooms } = useQueryRoom();
  const { data: admissions } = useQueryAdmission();
  useSubscribeRoom();
  useSubscribeAdmissions();

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

  useEffect(() => {
    async function createAdmission() {
      if (admissions && user && roomId) {
        const self = admissions.filter(
          (admission) =>
            admission.user_id === user.id && admission.room_id === roomId
        );
        if (self.length === 0) {
          await createAdmissionMutation.mutateAsync({
            user_id: user.id,
            room_id: roomId,
          });
        }
      }
    }
    createAdmission();
  }, [admissions, user, createAdmissionMutation, roomId]);

  const handleExitClick = async (e: any) => {
    e.preventDefault();
    await deleteAdmissionMutation.mutateAsync(user!.id);
    router.push("/lobby");
  };

  const roomName = () => {
    return rooms?.find((room) => room.id === roomId)?.name || "";
  };

  const fibos = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  // const emojis = ["😰", "😞", "😐", "😀", "😊"];
  const userProfiles = [
    { id: "9bf2e07f-e5f8-46db-8d62-fced65643455", name: "Yuki Sakamoto" },
    { id: "", name: "Jiro" },
    { id: "", name: "Saburo" },
  ];

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
          <SignOutButton />
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
            {admissions?.flatMap((admission) => {
              if (admission.room_id !== roomId) return [];
              const user = userProfiles.find(
                (profile) => profile.id === admission.user_id
              );
              return (
                <CardSlot
                  key={admission.id}
                  state="up"
                  name={user?.name || ""}
                  value={"😅"}
                />
              );
            })}
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
