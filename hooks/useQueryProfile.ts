import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "react-query";

import { ProfileQueryKey } from "../lib";
import { Profile } from "../types/";

const TABLE_NAME = "profiles" as const;

export const useQueryProfile = () => {
  const supabase = useSupabaseClient();
  const getProfile = async (): Promise<Profile[]> => {
    const { data, error } = await supabase.from(TABLE_NAME).select();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  return useQuery<Profile[], Error>({
    queryKey: [ProfileQueryKey],
    queryFn: getProfile,
    staleTime: Infinity,
  });
};
