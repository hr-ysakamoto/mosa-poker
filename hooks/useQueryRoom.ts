import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "react-query";

import { RoomQueryKey } from "../lib";
import { Room } from "../types/";

const TABLE_NAME = "rooms" as const;

export const useQueryRoom = () => {
  const supabase = useSupabaseClient();
  const getRooms = async (): Promise<Room[]> => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select()
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  return useQuery<Room[], Error>({
    queryKey: [RoomQueryKey],
    queryFn: getRooms,
    staleTime: Infinity,
  });
};
