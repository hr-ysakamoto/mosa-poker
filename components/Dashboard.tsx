import { FC } from "react";
import { Button } from "@mui/material";
import { supabase } from "../utils/supabase";

const signOut = () => {
  supabase.auth.signOut();
};

export const Dashboard: FC = () => {
  return <Button onClick={signOut}>Log Out</Button>;
};
