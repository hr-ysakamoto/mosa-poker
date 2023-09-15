import { Button } from "@mui/material";
import React from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import LogoutIcon from "@mui/icons-material/Logout";
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
