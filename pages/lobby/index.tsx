import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import { Avatar, IconButton, Stack, Typography } from "@mui/material";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { CreateRoomForm, InvitationForm } from "../../components";
import { useQueryProfile, useMutateAdmission } from "../../hooks";
import useStore from "../../store";

export default function Lobby() {
  const updateRoom = useStore((state) => state.setCurrentRoomId);
  const editedProfile = useStore((state) => state.editedProfile);
  const { createAdmissionMutation } = useMutateAdmission();
  const { data: profiles } = useQueryProfile();
  const user = useUser();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [invitationRoomId, setInvitationRoomId] = useState<string | undefined>(
    undefined
  );

  const profile = profiles?.find((profile) => profile.id === user?.id);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (router.isReady && router.query.invite) {
      const roomId = String(router.query.invite);
      setInvitationRoomId(roomId);
    }
  }, [router]);

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
    router.replace(
      `/profile${invitationRoomId ? `?invite=${invitationRoomId}` : ""}`
    );
  };

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <Stack sx={{ m: 5 }}>
      {isClient && (
        <Stack
          spacing={2}
          sx={{ pb: 3 }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Avatar>
            <PersonIcon />
          </Avatar>
          <Typography sx={{ m: 3 }} variant="h5" textAlign="center">
            {editedProfile.user_name || profile?.user_name}
          </Typography>
          <IconButton size="small" onClick={handleEditClick}>
            <EditIcon />
          </IconButton>
        </Stack>
      )}
      {!!invitationRoomId && (
        <InvitationForm
          roomId={invitationRoomId}
          onClick={(e) => handleInvitationJoinClick(e)}
        />
      )}
      {/* 招待されていない場合 */}
      {!invitationRoomId && <CreateRoomForm />}
    </Stack>
  );
}
