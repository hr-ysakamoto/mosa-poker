import { useQuery } from "react-query";
import { Room } from "../types/";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const useQueryRoom = () => {
  const supabase = useSupabaseClient();
  const getRooms = async (): Promise<Room[]> => {
    const { data, error } = await supabase
      .from("rooms")
      .select()
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  return useQuery<Room[], Error>({
    queryKey: ["rooms"],
    queryFn: getRooms,
    staleTime: Infinity,
  });
};
