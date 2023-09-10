import { useMutation, useQueryClient } from "react-query";
import { Room } from "../types";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

export const useMutateRoom = () => {
  const user = useUser();
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();

  const createRoomMutation = useMutation(
    async (room: Omit<Room, "created_at">) => {
      const { data, error } = await supabase
        .from("rooms")
        .insert(room)
        .eq("owner_id", user?.id)
        .order("created_at", { ascending: false })
        .select()
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (data: Room) => {
        let previousRooms = queryClient.getQueryData<Room[]>(["rooms"]);
        if (!previousRooms) {
          previousRooms = [];
        }
        const newRooms = [
          ...previousRooms,
          {
            id: data.id,
            created_at: data.created_at,
            owner_id: data.owner_id,
            name: data.name,
          },
        ];
        queryClient.setQueryData<Room[]>(["rooms"], newRooms);
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
        .eq("owner_id", user?.id);
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
        .eq("owner_id", user?.id);
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
