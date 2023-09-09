import { FC, useEffect } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export const Auth: FC = () => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log({ user });
    if (user) router.replace("/robby");
  }, [user]);

  return (
    <SupabaseAuth
      supabaseClient={supabase}
      localization={{
        variables: {
          sign_in: {
            email_input_placeholder: "Email",
            password_input_placeholder: "Password",
          },
        },
      }}
      appearance={{ theme: ThemeSupa }}
      providers={[]} // TODO: Google認証に対応する
    />
  );
};
