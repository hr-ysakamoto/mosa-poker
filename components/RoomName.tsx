import { Typography } from "@mui/material";
import React, { FC } from "react";
import { useQueryRoom } from "../hooks/useQueryRoom";

export const RoomName: FC = () => {
  const { data: room } = useQueryRoom();
  return (
    <>
      <Typography sx={{ pb: 3 }} variant="body1" align="center">
        Your room
      </Typography>
    </>
  );
};
