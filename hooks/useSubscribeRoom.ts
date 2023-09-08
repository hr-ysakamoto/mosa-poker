import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { supabase } from "../utils/supabase";
import {
  RealtimePostgresDeletePayload,
  RealtimePostgresInsertPayload,
} from "@supabase/supabase-js";
import { Room } from "../types";

export const useSubscribeRoom = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const subscription = supabase
      .channel(`public:rooms`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE", // "INSERT" | "UPDATE" | "DELETE" のように特定イベントだけの購読も可能
          schema: "public",
          table: "rooms",
        },
        (payload) => {
          console.log({ payload });
          let previous = queryClient.getQueryData<Room[]>(["rooms"]);
          if (!previous) {
            previous = [];
          }
          queryClient.setQueryData(
            ["rooms"],
            previous.map((room) =>
              room.id === payload.new.id
                ? {
                    id: payload.new.id,
                    created_at: payload.new.created_at,
                    owner_id: payload.new.user_id,
                    name: payload.new.name,
                  }
                : room
            )
          );
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient]);
};
