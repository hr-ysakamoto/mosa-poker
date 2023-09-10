import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { v4 } from "uuid";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useMutateRoom } from "../../hooks/useMutateRoom";
import { useQueryProfile } from "../../hooks/useQueryProfile";
import useStore from "../../store";

export default function Robby() {
  const editedRoom = useStore((state) => state.editedRoom);
  const update = useStore((state) => state.updateEditedRoom);
  const { createRoomMutation } = useMutateRoom();
  const { data: profile } = useQueryProfile();
  console.log({ profile });
  const user = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClick = async (e: any) => {
    e.preventDefault();
    const uuid = v4();
    await createRoomMutation.mutateAsync({
      ...editedRoom,
      id: uuid,
      owner_id: user?.id,
    });
    router.push(`/room/${uuid}`);
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
            <Typography variant="body1" sx={{ pb: 3 }}>
              username: {profile?.user_name}
            </Typography>
          </>
        )}
        <TextField
          sx={{ pb: 3 }}
          id="outlined-basic"
          label="Room name"
          variant="outlined"
          value={editedRoom.name}
          onChange={(e) => update({ ...editedRoom, name: e.target.value })}
        />
        <Button
          variant="contained"
          size="large"
          onClick={handleClick}
          disabled={!editedRoom.name}
        >
          Create Room
        </Button>
      </Stack>
    </>
  );
}
