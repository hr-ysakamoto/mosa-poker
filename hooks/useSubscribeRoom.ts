import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { supabase } from "../utils/supabase";
import { Room } from "../types";

export const useSubscribeRoom = () => {
  const queryClient = useQueryClient();
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
            queryClient.setQueryData<Room>(["room"], {
              id: payload.new.id,
              created_at: payload.new.created_at,
              owner_id: payload.new.owner_id,
              name: payload.new.name,
            });
          } else if (payload.eventType === "UPDATE") {
            queryClient.setQueryData<Room>(["room"], {
              id: payload.new.id,
              created_at: payload.new.created_at,
              owner_id: payload.new.owner_id,
              name: payload.new.name,
            });
          } else if (payload.eventType === "DELETE") {
            queryClient.setQueryData<Room | undefined>(["room"], undefined);
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient]);
};
