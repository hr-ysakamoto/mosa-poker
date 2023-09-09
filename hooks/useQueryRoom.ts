import { useQuery } from "react-query";
import { supabase } from "../utils/supabase";
import { Room } from "../types/";
import useStore from "../store";

export const useQueryRoom = () => {
  const session = useStore((state) => state.session);
  const getRoom = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select()
      .eq("owner_id", session!.user?.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    console.log({ data });
    return data;
  };
  return useQuery<Room | undefined, Error>({
    queryKey: ["room"],
    queryFn: getRoom,
    staleTime: Infinity,
  });
};
