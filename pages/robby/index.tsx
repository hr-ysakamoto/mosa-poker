import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { CreateRoomForm } from "../../components/CreateRoomForm";
import useStore from "../../store";

export default function Robby() {
  const router = useRouter();
  const session = useStore((state) => state.session);
  useEffect(() => {
    if (!session) {
      router.replace("/");
    }
  }, [session, router]);
  return <CreateRoomForm />;
}
