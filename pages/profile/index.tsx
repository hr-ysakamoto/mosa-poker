import React from "react";
import { Button, Stack, TextField } from "@mui/material";
import useStore from "../../store";
import { useRouter } from "next/router";
import { useMutateProfile } from "../../hooks/useMutateProfile";

export default function Profile() {
  const editedProfile = useStore((state) => state.editedProfile);
  const update = useStore((state) => state.updateEditedProfile);
  const router = useRouter();
  const { createProfileMutation } = useMutateProfile();

  const handleClick = async (e: any) => {
    e.preventDefault();
    await createProfileMutation.mutateAsync({
      ...editedProfile,
    });
    router.push("/robby");
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
          onClick={handleClick}
          disabled={!editedProfile.user_name}
        >
          UPDATE
        </Button>
      </Stack>
    </>
  );
}
