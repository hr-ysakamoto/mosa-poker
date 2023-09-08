import { useQuery } from "react-query";
import { supabase } from "../utils/supabase";
import { Room } from "../types/";
import useStore from "../store";

export const useQueryRoom = () => {
  const session = useStore((state) => state.session);
  const getRoom = async () => {
    console.log("useQueryRoom");
    const { data, error, status } = await supabase
      .from("rooms")
      .select("*")
      .eq("owner_id", session?.user?.id!)
      .single();
    if (error && status !== 406) {
      throw new Error(error.message);
    }
    console.log({ data });
    return data;
  };
  return useQuery<Room, Error>({
    queryKey: ["room"],
    queryFn: getRoom,
    staleTime: Infinity,
  });
};
