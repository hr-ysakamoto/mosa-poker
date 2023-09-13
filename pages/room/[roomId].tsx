import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { Box, Button, Stack, Typography } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CurtainsIcon from "@mui/icons-material/Curtains";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import useStore from "../../store";
import { useQueryRoom } from "../../hooks/useQueryRoom";
import { useQueryAdmission } from "../../hooks/useQueryAdmission";
import { useSubscribeRoom } from "../../hooks/useSubscribeRoom";
import { useMutateAdmission } from "../../hooks/useMutateAdmission";
import { useMutateRoom } from "../../hooks/useMutateRoom";
import { useSubscribeAdmissions } from "../../hooks/useSubscribeAdmissions";
import { CardSlot, Hand } from "../../components";
import { SignOutButton } from "../../components/SignOutButton";
import { Room } from "../../types";

export default function RoomPage() {
  const router = useRouter();
  const roomId = useStore((state) => state.currentRoomId);
  const updateRoom = useStore((state) => state.setCurrentRoomId);
  const user = useUser();
  const [room, setRoom] = useState<Room>();
  const { updateAdmissionMutation, deleteAdmissionMutation } =
    useMutateAdmission();
  const { updateRoomMutation } = useMutateRoom();
  const { data: rooms } = useQueryRoom();
  const { data: admissions } = useQueryAdmission();

  useSubscribeRoom(roomId!);
  useSubscribeAdmissions(roomId!);

  useEffect(() => {
    if (admissions && user && router.isReady && !roomId) {
      const currentRoomId = String(router.query.roomId);
      const loginUser = admissions.find(
        (x) => x.user_id === user.id && x.room_id === currentRoomId
      );
      // リロードなどでの再入場とみなし、storeにセット
      if (loginUser) {
        updateRoom(currentRoomId);
      } else {
        // 入室情報がない場合、招待リンク経由とみなす
        router.replace(`/lobby?invite=${currentRoomId}`);
      }
    }
  }, [router, user, admissions, roomId, updateRoom]);

  useEffect(() => {
    if (rooms && roomId) {
      const room = rooms.find((room) => room.id === roomId);
      setRoom(room);
    }
  }, [rooms, roomId]);

  const handleExitClick = async (e: any) => {
    e.preventDefault();
    await deleteAdmissionMutation.mutateAsync(user!.id);
    router.push("/lobby");
  };

  const handleRevealClick = async (e: any) => {
    e.preventDefault();
    await updateRoomMutation.mutateAsync({
      id: roomId!,
      created_at: room?.created_at || "",
      name: room?.name || "",
      owner_id: room?.owner_id || "",
      status: "Up",
    });
  };

  const handleResetClick = async (e: any) => {
    e.preventDefault();
    await updateRoomMutation.mutateAsync({
      id: roomId!,
      created_at: room?.created_at || "",
      name: room?.name || "",
      owner_id: room?.owner_id || "",
      status: "Down",
    });
  };

  const handleHandClick = async (e: any, value: string) => {
    e.preventDefault();
    const target = admissions?.find(
      (admission) =>
        admission.user_id === user?.id && admission.room_id === roomId
    );
    await updateAdmissionMutation.mutateAsync({
      id: target?.id!,
      created_at: room?.created_at || "",
      user_id: user?.id || "",
      room_id: room?.id || "",
      card: value,
    });
  };

  const fibos = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  // const emojis = ["😰", "😞", "😐", "😀", "😊"];
  const userProfiles = [
    { id: "9bf2e07f-e5f8-46db-8d62-fced65643455", name: "Yuki" },
    { id: "55ac9087-321e-451f-b964-2f9e9d72cccf", name: "mossari" },
  ];

  return (
    room && (
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
          {room?.name || "Loading..."}
        </Typography>
        <Stack
          sx={{ p: 3 }}
          spacing={2}
          direction="row"
          justifyContent="center"
        >
          <Button
            variant="outlined"
            size="large"
            startIcon={<CurtainsIcon />}
            onClick={handleRevealClick}
          >
            REVEAL
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<RestartAltIcon />}
            onClick={handleResetClick}
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
                  state={room?.status || "Down"}
                  name={user?.name || ""}
                  value={admission.card || ""}
                />
              );
            })}
          </Stack>
        </Box>
        <Button onClick={(e) => handleHandClick(e, "12")}>tesut</Button>
        <Stack sx={{ p: 3 }} direction="row" justifyContent="center">
          {fibos.map((value) => (
            <Hand
              key={value}
              value={value.toString()}
              onClick={(e) => handleHandClick(e, value.toString())}
            />
          ))}
        </Stack>
      </Stack>
    )
  );
}
