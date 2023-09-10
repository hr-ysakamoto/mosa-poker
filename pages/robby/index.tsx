import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { CreateRoomForm } from "../../components/CreateRoomForm";
import { useUser } from "@supabase/auth-helpers-react";

export default function Robby() {
  const user = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);
  return <CreateRoomForm />;
}
