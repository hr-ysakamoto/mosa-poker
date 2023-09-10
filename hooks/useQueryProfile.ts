import { useQuery } from "react-query";
import { Profile } from "../types/";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const useQueryProfile = () => {
  const supabase = useSupabaseClient();
  const getProfile = async (): Promise<Profile> => {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  return useQuery<Profile, Error>({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: Infinity,
  });
};