import { FC, Suspense, memo } from "react";
import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import useStore from "../store";
import { useMutateRoom } from "../hooks/useMutateRoom";
import { useQueryRoom } from "../hooks/useQueryRoom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorIcon from "@mui/icons-material/Error";
import { RoomName } from "./RoomName";
import { useRouter } from "next/router";

export const CreateRoomMemo: FC = () => {
  const session = useStore((state) => state.session);
  const editedRoom = useStore((state) => state.editedRoom);
  const update = useStore((state) => state.updateEditedRoom);
  const router = useRouter();
  const { createRoomMutation, deleteRoomMutation } = useMutateRoom();

  const handleClick = async (e: any) => {
    e.preventDefault();
    await deleteRoomMutation.mutateAsync(session?.user?.id!);
    await createRoomMutation.mutateAsync(
      {
        ...editedRoom,
        owner_id: session?.user?.id,
      },
      { onSuccess: () => router.push("/room/test") }
    );
  };

  return (
    <>
      <Stack sx={{ m: 5 }}>
        {/* <Typography sx={{ pb: 3 }} variant="body1" align="center">
          Your room: {!room || !room.length ? "No room" : room[0].name}
        </Typography> */}
        <ErrorBoundary
          fallback={<ErrorIcon className="my-5 h-10 w-10 text-pink-500" />}
        >
          <Suspense fallback={<CircularProgress />}>
            <RoomName />
          </Suspense>
        </ErrorBoundary>

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
          Create
        </Button>
      </Stack>
    </>
  );
};

export const CreateRoom = memo(CreateRoomMemo);
