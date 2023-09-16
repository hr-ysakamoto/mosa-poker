import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { IconButton, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useQueryProfile } from "../../hooks/useQueryProfile";
import { useMutateAdmission } from "../../hooks/useMutateAdmission";
import { InvitationForm } from "../../components/InvitationForm";
import { CreateRoomForm } from "../../components/CreateRoomForm";
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
    router.push("/profile");
  };

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <Stack sx={{ m: 5 }}>
      {isClient && (
        <>
          <Typography sx={{ m: 2 }} variant="h5" textAlign="center">
            {editedProfile.user_name || profile?.user_name}
            <IconButton sx={{ ml: 1 }} size="small" onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
          </Typography>
        </>
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
