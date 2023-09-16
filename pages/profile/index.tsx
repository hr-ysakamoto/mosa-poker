import React, { use } from "react";
import { Button, Stack, TextField } from "@mui/material";
import useStore from "../../store";
import { useRouter } from "next/router";
import { useMutateProfile } from "../../hooks/useMutateProfile";
import { useUser } from "@supabase/auth-helpers-react";
import { useQueryProfile } from "../../hooks/useQueryProfile";

export default function Profile() {
  const { data: profiles } = useQueryProfile();
  const editedProfile = useStore((state) => state.editedProfile);
  const update = useStore((state) => state.updateEditedProfile);
  const router = useRouter();
  const user = useUser();

  const { updateProfileMutation } = useMutateProfile();

  const handleUpdateClick = async (e: any) => {
    e.preventDefault();
    await updateProfileMutation.mutateAsync({
      id: user!.id,
      ...editedProfile,
    });
    router.push("/lobby");
  };

  return (
    <>
      <Stack sx={{ m: 5 }}>
        <TextField
          sx={{ pb: 3 }}
          id="outlined-basic"
          label="name"
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
