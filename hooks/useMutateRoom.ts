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
        const newRooms = [
          ...previousRooms,
          {
            id: data.id,
            created_at: data.created_at,
            owner_id: data.owner_id,
            name: data.name,
            status: data.status,
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
    async (room: Room) => {
      const { error } = await supabase
        .from("rooms")
        .update({
          name: room.name,
          owner_id: room.owner_id,
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
          if (room.id === data.id) {
            room.id = data.id;
            room.created_at = data.created_at;
            room.owner_id = data.owner_id;
            room.name = data.name;
            room.status = data.status;
          }
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
