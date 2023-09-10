import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Room } from "../types";

export const useSubscribeRoom = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();
  useEffect(() => {
    const subscription = supabase
      .channel(`public:rooms`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            console.log("insert payload: ", payload);
            let previousRooms = queryClient.getQueryData<Room[]>(["rooms"]);
            if (!previousRooms) {
              previousRooms = [];
            }
            const newRooms = [
              ...previousRooms,
              {
                id: payload.new.id,
                created_at: payload.new.created_at,
                owner_id: payload.new.owner_id,
                name: payload.new.name,
              },
            ];
            queryClient.setQueryData<Room[]>(["rooms"], newRooms);
          } else if (payload.eventType === "UPDATE") {
            let previousRooms = queryClient.getQueryData<Room[]>(["rooms"]);
            if (!previousRooms) {
              previousRooms = [];
            }
            const newRooms = previousRooms.map((room) => {
              if (room.id === payload.new.id) {
                room.id = payload.new.id;
                room.created_at = payload.new.created_at;
                room.owner_id = payload.new.owner_id;
                room.name = payload.new.name;
              }
              return room;
            });
            queryClient.setQueryData<Room[]>(["rooms"], newRooms);
          } else if (payload.eventType === "DELETE") {
            let previousRooms = queryClient.getQueryData<Room[]>(["rooms"]);
            if (!previousRooms) {
              previousRooms = [];
            }
            const newRooms = previousRooms.filter(
              (room) => room.id !== payload.old.id
            );
            queryClient.setQueryData<Room[]>(["rooms"], newRooms);
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient, supabase]);
};
