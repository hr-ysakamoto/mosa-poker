import { useQuery } from "react-query";
import { Profile } from "../types/";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ProfileQueryKey } from "../lib";

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
