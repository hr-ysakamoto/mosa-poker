import { Layout } from "../components/Layout";
import { Auth, Dashboard } from "../components";
import { useEffect } from "react";
import useStore from "../store";
import { supabase } from "../utils/supabase";
import { Create } from "@mui/icons-material";
import { CreateRoom } from "../components/CreateRoom";

export default function Index() {
  const session = useStore((state) => state.session);
  const setSession = useStore((state) => state.setSession);
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
    // <Layout title="Mosa-Poker">{!session ? <Auth /> : <Dashboard />}</Layout>
    <Layout title="Mosa-Poker">
      <CreateRoom />
    </Layout>
  );
}
