import { useEffect } from "react";
import { AuthForm, Layout } from "../components";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default function Index() {
  const user = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user) router.push("/lobby");
  }, [user, router]);

  return (
    <Layout title="Mosa-Poker">
      <AuthForm />
    </Layout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createPagesServerClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session)
    return {
      redirect: {
        destination: "/lobby",
        permanent: false,
      },
    };
  return {
    props: {},
  };
};
