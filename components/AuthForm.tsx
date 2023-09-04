import { FC } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../utils/supabase";

export const Auth: FC = () => {
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
