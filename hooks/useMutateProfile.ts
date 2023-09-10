import { useMutation, useQueryClient } from "react-query";
import { Profile } from "../types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const useMutateProfile = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();

  const createProfileMutation = useMutation(
    async (profile: Omit<Profile, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(profile)
        .order("created_at", { ascending: false })
        .select()
        .limit(1)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (data: Profile) => {
        console.log({ data });
        queryClient.setQueryData<Profile>(["profile"], data);
      },
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );
  return {
    createProfileMutation,
  };
};
