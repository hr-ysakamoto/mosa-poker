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
        .insert(profile)
        .order("created_at", { ascending: false })
        .select();

      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (data: Profile[]) => {
        let previousProfiles = queryClient.getQueryData<Profile[]>([
          "profiles",
        ]);
        if (!previousProfiles) {
          previousProfiles = [];
        }
        const newProfiles = [...previousProfiles, ...data];
        queryClient.setQueryData<Profile[]>(["profiles"], newProfiles);
      },
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );
  const updateProfileMutation = useMutation(
    async (profile: Omit<Profile, "created_at">) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({ user_name: profile.user_name })
        .order("created_at", { ascending: false })
        .eq("id", profile.id)
        .select()
        .limit(1)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (data: Profile) => {
        let previousProfiles = queryClient.getQueryData<Profile[]>([
          "profiles",
        ]);
        console.log({ previousProfiles });
        if (!previousProfiles) {
          previousProfiles = [];
        }
        const newProfiles = previousProfiles.map((profile) => {
          if (profile.id === data.id) return data;
          return profile;
        });
        console.log({ newProfiles });
        queryClient.setQueryData<Profile[]>(["profiles"], newProfiles);
      },
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );
  return {
    createProfileMutation,
    updateProfileMutation,
  };
};
