import React from "react";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useMutateAdmission } from "../hooks/useMutateAdmission";

export const SignOutButton = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const user = useUser();
  const { deleteAdmissionMutation } = useMutateAdmission();

  const handleSignOutClick = async (e: any) => {
    e.preventDefault();
    await deleteAdmissionMutation.mutateAsync(user!.id);
    supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Button
      variant="text"
      startIcon={<LogoutIcon />}
      onClick={handleSignOutClick}
    >
      SIGN OUT
    </Button>
  );
};
