import { FC } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const AuthForm: FC = () => {
  const supabaseClient = useSupabaseClient();
  return (
    <SupabaseAuth
      supabaseClient={supabaseClient}
      localization={{
        variables: {
          sign_in: {
            email_label: "Email",
            password_label: "Password",
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
