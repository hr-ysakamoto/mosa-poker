import { Button } from "@mui/material";
import React from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import LogoutIcon from "@mui/icons-material/Logout";

export const SignOutButton = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleSignOutClick = (e: any) => {
    e.preventDefault();
    supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Button
      variant="contained"
      startIcon={<LogoutIcon />}
      onClick={handleSignOutClick}
    >
      SIGN OUT
    </Button>
  );
};
