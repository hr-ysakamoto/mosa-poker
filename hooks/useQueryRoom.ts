import { useQuery } from "react-query";
import { supabase } from "../utils/supabase";
import { Room } from "../types/";
import useStore from "../store";

export const useQueryRoom = () => {
  const session = useStore((state) => state.session);
  console.log({ session });
  const getRoom = async (): Promise<Room> => {
    // const { data, error } = await supabase
    //   .from("rooms")
    //   .select()
    //   .eq("owner_id", session?.user?.id)
    //   .order("created_at", { ascending: false })
    //   .limit(1)
    //   .maybeSingle();
    const { data, error } = await supabase
      .from("rooms")
      .select()
      //.eq("owner_id", session!.user?.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    console.log({ data });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  return useQuery<Room, Error>({
    queryKey: ["room"],
    queryFn: getRoom,
    staleTime: Infinity,
  });
};
