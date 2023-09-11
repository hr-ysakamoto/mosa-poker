import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { v4 } from "uuid";
import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutateRoom } from "../../hooks/useMutateRoom";
import { useQueryProfile } from "../../hooks/useQueryProfile";
import { useQueryAdmission } from "../../hooks/useQueryAdmission";
import EditIcon from "@mui/icons-material/Edit";
import useStore from "../../store";
import { useMutateAdmission } from "../../hooks/useMutateAdmission";
import { SignOutButton } from "../../components/SignOutButton";

export default function Lobby() {
  const editedRoom = useStore((state) => state.editedRoom);
  const updateEditedRoom = useStore((state) => state.updateEditedRoom);
  const updateRoom = useStore((state) => state.setCurrentRoomId);
  const { createRoomMutation } = useMutateRoom();
  const { createAdmissionMutation } = useMutateAdmission();
  const { data: profile } = useQueryProfile();
  const { data: admissions } = useQueryAdmission();

  const user = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [invitationRoomId, setInvitationRoomId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (router.isReady && router.query.invite) {
      const roomId = String(router.query.invite);
      setInvitationRoomId(roomId);
    }
  }, [router]);

  const handleCreateClick = async (e: any) => {
    e.preventDefault();
    const uuid = v4();
    await createRoomMutation.mutateAsync({
      ...editedRoom,
      id: uuid,
      owner_id: user?.id,
      status: "Down",
    });
    await createAdmissionMutation.mutateAsync({
      user_id: user!.id,
      room_id: uuid,
      card: "",
    });
    updateRoom(uuid);
    router.push(`/room/${uuid}`);
  };

  const handleJoinClick = async (e: any) => {
    e.preventDefault();
    const target = admissions?.reduce((prev, current) => {
      return current.created_at > prev.created_at ? current : prev;
    }, admissions[0]);
    const roomId = target?.room_id;
    updateRoom(roomId!);
    router.push(`/room/${roomId!}`);
  };

  const handleInvitationJoinClick = async (e: any) => {
    e.preventDefault();
    await createAdmissionMutation.mutateAsync({
      user_id: user!.id,
      room_id: invitationRoomId!,
      card: "",
    });
    updateRoom(invitationRoomId!);
    router.push(`/room/${invitationRoomId}`);
  };

  const handleEditClick = (e: any) => {
    e.preventDefault();
    router.push("/profile");
  };

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <>
      <Stack sx={{ m: 5 }}>
        {isClient && (
          <>
            <Typography sx={{ m: 2 }} variant="h5" textAlign="center">
              {profile?.user_name}
              <IconButton sx={{ ml: 1 }} size="small" onClick={handleEditClick}>
                <EditIcon />
              </IconButton>
            </Typography>
          </>
        )}
        {invitationRoomId !== undefined && (
          <>
            <Typography variant="body1">Room ID: {invitationRoomId}</Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={handleInvitationJoinClick}
                disabled={!invitationRoomId}
              >
                JOIN
              </Button>
              <SignOutButton />
            </Stack>
          </>
        )}
        {invitationRoomId === undefined && (
          <>
            <TextField
              sx={{ pb: 3 }}
              id="outlined-basic"
              label="Room name"
              variant="outlined"
              value={editedRoom.name}
              onChange={(e) =>
                updateEditedRoom({ ...editedRoom, name: e.target.value })
              }
            />
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={handleCreateClick}
                disabled={!editedRoom.name}
              >
                CREATE
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleJoinClick}
                disabled={
                  !admissions?.filter((x) => x.user_id === user?.id)?.length
                }
              >
                JOIN
              </Button>
              <SignOutButton />
            </Stack>
          </>
        )}
      </Stack>
    </>
  );
}
