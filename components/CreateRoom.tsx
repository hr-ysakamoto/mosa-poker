import { Button, Stack, TextField } from "@mui/material";
import React from "react";

export const CreateRoom = () => {
  return (
    <>
      <Stack sx={{ m: 5 }}>
        <TextField
          sx={{ pb: 3 }}
          id="outlined-basic"
          label="Room name"
          variant="outlined"
        />
        <Button variant="contained" size="large">
          Create
        </Button>
      </Stack>
    </>
  );
};
