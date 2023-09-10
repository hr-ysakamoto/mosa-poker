import { FC, memo } from "react";
import { useRouter } from "next/router";
import { v4 } from "uuid";
import { Button, Stack, TextField } from "@mui/material";
import { useMutateRoom } from "../hooks/useMutateRoom";
import useStore from "../store";
import { useUser } from "@supabase/auth-helpers-react";

export const CreateRoomFormMemo: FC = () => {
  const editedRoom = useStore((state) => state.editedRoom);
  const update = useStore((state) => state.updateEditedRoom);
  const router = useRouter();
  const user = useUser();
  const { createRoomMutation } = useMutateRoom();

  /**
   * @description Create a room and redirect to the room page
   * @param e
   */
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

  return (
    <Stack sx={{ m: 5 }}>
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
  );
};

export const CreateRoomForm = memo(CreateRoomFormMemo);
