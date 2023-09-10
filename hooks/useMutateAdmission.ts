import { useMutation, useQueryClient } from "react-query";
import { Admission } from "../types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const useMutateAdmission = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();

  const createAdmissionMutation = useMutation(
    async (admission: Omit<Admission, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("admissions")
        .insert(admission)
        .order("created_at", { ascending: false })
        .select()
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (data: Admission) => {
        let previousAdmissions = queryClient.getQueryData<Admission[]>([
          "admissions",
        ]);
        if (!previousAdmissions) {
          previousAdmissions = [];
        }
        const newAdmissions = [
          ...previousAdmissions,
          {
            id: data.id,
            created_at: data.created_at,
            user_id: data.user_id,
            room_id: data.room_id,
          },
        ];
        queryClient.setQueryData<Admission[]>(["admissions"], newAdmissions);
      },
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );
  return {
    createAdmissionMutation,
  };
};
