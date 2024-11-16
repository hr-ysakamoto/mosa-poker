import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useQueryClient } from "react-query";

import { AdmissionQueryKey } from "../lib";
import { AdmissionWithName } from "../types";

const TABLE_NAME = "admissions" as const;

export const useSubscribeAdmissions = (roomId: string) => {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();
  useEffect(() => {
    const subscription = supabase
      .channel(`public:${TABLE_NAME}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: TABLE_NAME,
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            let previousAdmissions = queryClient.getQueryData<
              AdmissionWithName[]
            >([AdmissionQueryKey]);
            if (!previousAdmissions) {
              previousAdmissions = [];
            }
            const newAdmissions = [
              ...previousAdmissions,
              {
                id: payload.new.id,
                created_at: payload.new.created_at,
                user_id: payload.new.user_id,
                user_name: payload.new.user_name,
                room_id: payload.new.room_id,
                card: payload.new.card,
              },
            ];
            queryClient.setQueryData<AdmissionWithName[]>(
              [AdmissionQueryKey],
              newAdmissions
            );
          } else if (payload.eventType === "UPDATE") {
            let previousAdmissions = queryClient.getQueryData<
              AdmissionWithName[]
            >([AdmissionQueryKey]);
            if (!previousAdmissions) {
              previousAdmissions = [];
            }
            const newAdmissions = previousAdmissions.map((admission) => {
              if (admission.id === payload.new.id) {
                admission.id = payload.new.id;
                admission.created_at = payload.new.created_at;
                admission.user_id = payload.new.user_id;
                admission.user_name = payload.new.user_name;
                admission.room_id = payload.new.room_id;
                admission.card = payload.new.card;
              }
              return admission;
            });
            queryClient.setQueryData<AdmissionWithName[]>(
              [AdmissionQueryKey],
              newAdmissions
            );
          } else if (payload.eventType === "DELETE") {
            let previousAdmissions = queryClient.getQueryData<
              AdmissionWithName[]
            >([AdmissionQueryKey]);
            if (!previousAdmissions) {
              previousAdmissions = [];
            }
            const newAdmissions = previousAdmissions.filter(
              (admission) => admission.id !== payload.old.id
            );
            queryClient.setQueryData<AdmissionWithName[]>(
              [AdmissionQueryKey],
              newAdmissions
            );
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient, supabase, roomId]);
};
