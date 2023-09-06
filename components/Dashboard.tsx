import { FC } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { supabase } from "../utils/supabase";
import { CardSlot, Hand } from "./";

const signOut = () => {
  supabase.auth.signOut();
};
const fibos = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
const emojis = ["😰", "😞", "😐", "😀", "😊"];
const users = ["Taro", "Jiro", "Saburo", "Shiro"];

export const Dashboard: FC = () => {
  return (
    <>
      <Button onClick={signOut}>Log Out</Button>
      <Stack sx={{ p: 4 }} spacing={2} direction="row" justifyContent="center">
        <Button variant="outlined">reveal</Button>
        <Button variant="outlined">reset</Button>
      </Stack>
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          {users.map((user) => (
            <CardSlot key={user} state="up" value={"😊"} />
          ))}
        </Stack>
      </Box>
      <Typography variant="h5" align="center">
        Select a card
      </Typography>
      <Stack sx={{ p: 5 }} direction="row" justifyContent="center">
        {fibos.map((value) => (
          <Hand key={value} value={value.toString()} />
        ))}
      </Stack>
    </>
  );
};
