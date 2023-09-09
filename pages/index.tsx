import { Layout } from "../components/Layout";
import { Auth } from "../components";
import { useEffect } from "react";
import useStore from "../store";
import { supabase } from "../utils/supabase";
import { CreateRoomForm } from "../components/CreateRoomForm";
import { useRouter } from "next/router";

export default function Index() {
  const session = useStore((state) => state.session);
  const setSession = useStore((state) => state.setSession);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
    })();
  }, [setSession]);

  return (
    <Layout title="Mosa-Poker">
      <Auth />
    </Layout>
  );
}
