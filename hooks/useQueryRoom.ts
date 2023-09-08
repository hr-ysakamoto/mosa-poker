import { useQuery } from "react-query";
import { supabase } from "../utils/supabase";
import { Room } from "../types/";
import useStore from "../store";

export const useQueryRoom = () => {
  const session = useStore((state) => state.session);
  const getRooms = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select()
      .eq("owner_id", session!.user?.id)
      .order("created_at", { ascending: true });

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
