import { useMutation, useQueryClient } from "react-query";
import { Room } from "../types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const useMutateRoom = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();

  const createRoomMutation = useMutation(
    async (room: Omit<Room, "created_at">) => {
      const { data, error } = await supabase
        .from("rooms")
        .insert(room)
        .eq("owner_id", room.owner_id)
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
        const newRooms = [...previousRooms, data];
        queryClient.setQueryData<Room[]>(["rooms"], newRooms);
      },
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );
  const updateRoomMutation = useMutation(
    async (room: Room) => {
      const { error } = await supabase
        .from("rooms")
        .update({
          name: room.name,
          status: room.status,
        })
        .eq("id", room.id);

      if (error) throw new Error(error.message);
      return room;
    },
    {
      onSuccess: (data: Room) => {
        let previousRooms = queryClient.getQueryData<Room[]>(["rooms"]);
        if (!previousRooms) {
          previousRooms = [];
        }
        const newRooms = previousRooms.map((room) => {
          if (room.id === data.id) return data;
          return room;
        });
        queryClient.setQueryData<Room[]>(["rooms"], newRooms);
      },
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
