import { useMutation } from "react-query";
import { supabase } from "../utils/supabase";
import { Room } from "../types";

export const useMutateRoom = () => {
  const createRoomMutation = useMutation(
    async (room: Omit<Room, "id" | "created_at">) => {
      const { data, error } = await supabase.from("rooms").insert(room);
      if (error) throw new Error(error.message);
      console.log({ data });
      return data;
    },
    {
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );
  const updateRoomMutation = useMutation(
    async (room: Room) => {
      const { data, error } = await supabase
        .from("rooms")
        .update({ name: room.name })
        .eq("id", room.id);
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
    async (ownerId: string) => {
      const { data, error } = await supabase
        .from("rooms")
        .delete()
        .eq("owner_id", ownerId);
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
