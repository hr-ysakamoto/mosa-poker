import { UseMutationResult, useMutation, useQueryClient } from "react-query";
import { supabase } from "../utils/supabase";
import { Room } from "../types";
import useStore from "../store";

export const useMutateRoom = () => {
  const session = useStore((state) => state.session);
  const queryClient = useQueryClient();

  const createRoomMutation = useMutation(
    async (room: Omit<Room, "created_at">) => {
      const { data, error } = await supabase
        .from("rooms")
        .insert(room)
        .eq("owner_id", session!.user?.id)
        .order("created_at", { ascending: false })
        .select()
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData<Room>(["room"], data);
      },
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );
  const updateRoomMutation = useMutation(
    async (room: Omit<Room, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("rooms")
        .update({ name: room.name })
        .eq("owner_id", session!.user?.id);
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );
  const deleteRoomMutation = useMutation(
    async () => {
      const { data, error } = await supabase
        .from("rooms")
        .delete()
        .eq("owner_id", session!.user?.id);
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );
  return {
    createRoomMutation,
    updateRoomMutation,
    deleteRoomMutation,
  };
};
