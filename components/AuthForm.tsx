import React from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../utils/supabase";

export const Auth = () => {
  return (
    <SupabaseAuth
      supabaseClient={supabase}
      localization={{
        variables: {
          sign_in: {
            email_label: "Email",
            password_label: "Password",
          },
        },
      }}
      appearance={{ theme: ThemeSupa }}
      providers={[]} // TODO: Google認証に対応する
    />
  );
};
