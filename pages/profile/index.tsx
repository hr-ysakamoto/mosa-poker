import PersonIcon from "@mui/icons-material/Person";
import { Avatar, Button, Stack, TextField } from "@mui/material";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React from "react";

import { useMutateProfile, useQueryProfile } from "../../hooks";
import useStore from "../../store";

export default function Profile() {
  const { data: profiles } = useQueryProfile();
  const editedProfile = useStore((state) => state.editedProfile);
  const update = useStore((state) => state.updateEditedProfile);
  const router = useRouter();
  const user = useUser();
  const profile = profiles?.find((profile) => profile.id === user?.id);

  const { createProfileMutation, updateProfileMutation } = useMutateProfile();

  const handleUpdateClick = async (e: any) => {
    e.preventDefault();
    const data = {
      id: user!.id,
      ...editedProfile,
    };
    if (profile) {
      await updateProfileMutation.mutateAsync(data);
    } else {
      await createProfileMutation.mutateAsync(data);
    }
    const invitationQuery = `?invite=${String(router.query.invite)}`;
    router.push(`/lobby${router.query.invite ? invitationQuery : ""}`);
  };

  return (
    <>
      <Stack sx={{ m: 2 }}>
        <Stack spacing={1} sx={{ pb: 3 }} direction="row" alignItems="center">
          <Avatar>
            <PersonIcon />
          </Avatar>
          <TextField
            id="outlined-basic"
            label="Your name"
            variant="outlined"
            value={editedProfile.user_name}
            onChange={(e) =>
              update({
                ...editedProfile,
                user_name: e.target.value,
                avatar_url: "", // TODO: add avatar_url
              })
            }
          />
        </Stack>
        <Button
          variant="contained"
          size="large"
          onClick={handleUpdateClick}
          disabled={!editedProfile.user_name}
        >
          UPDATE
        </Button>
      </Stack>
    </>
  );
}
