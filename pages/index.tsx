import { useEffect } from "react";
import useStore from "../store";
import { Auth, Layout } from "../components";
import { supabase } from "../utils/supabase";

export default function Index() {
  const session = useStore((state) => state.session);
  const setSession = useStore((state) => state.setSession);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      supabase.auth.onAuthStateChange((_event, session) => {
        console.log({ _event });
        setSession(session);
      });
    })();
  }, [session, setSession]);

  return (
    <Layout title="Mosa-Poker">
      <Auth />
    </Layout>
  );
}
