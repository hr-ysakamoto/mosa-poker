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

export default function Room() {
  const router = useRouter();
  const roomId = useStore((state) => state.currentRoomId);
  const updateRoom = useStore((state) => state.setCurrentRoomId);
  const user = useUser();
  const { deleteAdmissionMutation } = useMutateAdmission();
  const { updateRoomMutation } = useMutateRoom();
  const { data: rooms } = useQueryRoom();
  const { data: admissions } = useQueryAdmission();
  const [roomStatus, setRoomStatus] = useState<"Up" | "Down">("Down");

  console.log({ rooms });

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

  useSubscribeRoom(roomId!);
  useSubscribeAdmissions(roomId!);

  useEffect(() => {
    if (rooms && roomId) {
      const room = rooms.find((room) => room.id === roomId);
      setRoomStatus(room?.status || "Down");
    }
  }, [rooms, roomId]);

  const handleExitClick = async (e: any) => {
    e.preventDefault();
    await deleteAdmissionMutation.mutateAsync(user!.id);
    router.push("/lobby");
  };

  const handleRevealClick = async (e: any) => {
    e.preventDefault();
    const room = rooms?.find((room) => room.id === roomId);
    console.log("handleRevealClick");
    console.log({ room });
    await updateRoomMutation.mutateAsync({
      id: roomId!,
      created_at: room?.created_at || "",
      name: roomName(),
      owner_id: room?.owner_id || "",
      status: "Up",
    });
    setRoomStatus("Up");
  };

  const handleResetClick = async (e: any) => {
    e.preventDefault();
    const room = rooms?.find((room) => room.id === roomId);
    console.log("handleResetClick");
    console.log({ room });
    await updateRoomMutation.mutateAsync({
      id: roomId!,
      created_at: room?.created_at || "",
      name: roomName(),
      owner_id: room?.owner_id || "",
      status: "Down",
    });
    setRoomStatus("Down");
  };

  const roomName = () => {
    return rooms?.find((room) => room.id === roomId)?.name || "";
  };

  const fibos = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  // const emojis = ["😰", "😞", "😐", "😀", "😊"];
  const userProfiles = [
    { id: "9bf2e07f-e5f8-46db-8d62-fced65643455", name: "Yuki" },
    { id: "55ac9087-321e-451f-b964-2f9e9d72cccf", name: "mossari" },
  ];
  console.log("render");
  console.log({ rooms });
  console.log({ admissions });
  return (
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
      <Stack sx={{ p: 3 }} spacing={2} direction="row" justifyContent="center">
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
                state={rooms?.find((x) => x.id === roomId)?.status || "Down"}
                name={user?.name || ""}
                value={"😅"}
              />
            );
          })}
        </Stack>
      </Box>
      {/* <Typography variant="h5" align="center">
        Select a card
      </Typography> */}
      <Stack sx={{ p: 3 }} direction="row" justifyContent="center">
        {fibos.map((value) => (
          <Hand key={value} value={value.toString()} />
        ))}
      </Stack>
    </Stack>
  );
}
