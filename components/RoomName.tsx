import { Typography } from "@mui/material";
import React, { FC } from "react";
import { useQueryRoom } from "../hooks/useQueryRoom";

export const RoomName: FC = () => {
  const { data: room } = useQueryRoom();
  console.log("room: ", room);
  return (
    <>
      <Typography sx={{ pb: 3 }} variant="body1" align="center">
        Your room: {!room ? "No room" : room?.name}
      </Typography>
    </>
  );
};
