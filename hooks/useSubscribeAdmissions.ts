import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Admission } from "../types";

export const useSubscribeAdmissions = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();
  useEffect(() => {
    const subscription = supabase
      .channel(`public:admissions`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "admissions",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            let previousAdmissions = queryClient.getQueryData<Admission[]>([
              "admissions",
            ]);
            if (!previousAdmissions) {
              previousAdmissions = [];
            }
            const newAdmissions = [
              ...previousAdmissions,
              {
                id: payload.new.id,
                created_at: payload.new.created_at,
                user_id: payload.new.user_id,
                room_id: payload.new.room_id,
              },
            ];
            queryClient.setQueryData<Admission[]>(
              ["admissions"],
              newAdmissions
            );
          } else if (payload.eventType === "UPDATE") {
            let previousAdmissions = queryClient.getQueryData<Admission[]>([
              "admissions",
            ]);
            if (!previousAdmissions) {
              previousAdmissions = [];
            }
            const newAdmissions = previousAdmissions.map((admission) => {
              if (admission.id === payload.new.id) {
                admission.id = payload.new.id;
                admission.created_at = payload.new.created_at;
                admission.user_id = payload.new.user_id;
                admission.room_id = payload.new.room_id;
              }
              return admission;
            });
            queryClient.setQueryData<Admission[]>(
              ["admissions"],
              newAdmissions
            );
          } else if (payload.eventType === "DELETE") {
            let previousAdmissions = queryClient.getQueryData<Admission[]>([
              "admissions",
            ]);
            if (!previousAdmissions) {
              previousAdmissions = [];
            }
            const newAdmissions = previousAdmissions.filter(
              (admission) => admission.id !== payload.old.id
            );
            queryClient.setQueryData<Admission[]>(
              ["admissions"],
              newAdmissions
            );
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient, supabase]);
};
