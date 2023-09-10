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
  const deleteAdmissionMutation = useMutation(
    async (userId: string) => {
      const { error } = await supabase
        .from("admissions")
        .delete()
        .eq("user_id", userId);
      if (error) throw new Error(error.message);
      return userId;
    },
    {
      onSuccess: (userId: string) => {
        let previousAdmissions = queryClient.getQueryData<Admission[]>([
          "admissions",
        ]);
        const newData = previousAdmissions?.filter(
          (admission) => admission.user_id !== userId
        );
        queryClient.setQueryData<Admission[]>(["admissions"], newData || []);
      },
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );
  return {
    createAdmissionMutation,
    deleteAdmissionMutation,
  };
};
