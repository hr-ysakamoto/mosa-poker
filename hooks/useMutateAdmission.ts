import { useMutation, useQueryClient } from "react-query";
import { Admission } from "../types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AdmissionQueryKey } from "../lib";

const TABLE_NAME = "admissions" as const;

export const useMutateAdmission = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();

  const createAdmissionMutation = useMutation(
    async (admission: Omit<Admission, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from(TABLE_NAME)
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
          AdmissionQueryKey,
        ]);
        if (!previousAdmissions) {
          previousAdmissions = [];
        }
        const newAdmissions = [...previousAdmissions, data];
        queryClient.setQueryData<Admission[]>(
          [AdmissionQueryKey],
          newAdmissions
        );
      },
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );
  const updateAdmissionMutation = useMutation(
    async (admission: Admission) => {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({ card: admission.card })
        .order("created_at", { ascending: false })
        .eq("id", admission.id)
        .select()
        .limit(1)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (data: Admission) => {
        let previousAdmissions = queryClient.getQueryData<Admission[]>([
          AdmissionQueryKey,
        ]);
        if (!previousAdmissions) {
          previousAdmissions = [];
        }
        const newAdmissions = previousAdmissions.map((admission) => {
          if (admission.id === data.id) return data;
          return admission;
        });
        queryClient.setQueryData<Admission[]>(
          [AdmissionQueryKey],
          newAdmissions
        );
      },
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );
  const deleteAdmissionMutation = useMutation(
    async (userId: string) => {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq("user_id", userId);
      if (error) throw new Error(error.message);
      return userId;
    },
    {
      onSuccess: (userId: string) => {
        let previousAdmissions = queryClient.getQueryData<Admission[]>([
          AdmissionQueryKey,
        ]);
        const newData = previousAdmissions?.filter(
          (admission) => admission.user_id !== userId
        );
        queryClient.setQueryData<Admission[]>(
          [AdmissionQueryKey],
          newData || []
        );
      },
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );
  const resetAdmissionMutation = useMutation(
    async (roomId: string) => {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({ card: "" })
        .order("created_at", { ascending: false })
        .eq("room_id", roomId)
        .select();

      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (data: Admission[]) => {
        let previousAdmissions = queryClient.getQueryData<Admission[]>([
          AdmissionQueryKey,
        ]);
        if (!previousAdmissions) {
          previousAdmissions = [];
        }
        const ids = data.map((admission) => admission.id);
        const rest = previousAdmissions.filter((x) => !ids.includes(x.id));
        const newAdmissions = [...rest, ...data];
        queryClient.setQueryData<Admission[]>(
          [AdmissionQueryKey],
          newAdmissions
        );
      },
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );
  return {
    createAdmissionMutation,
    updateAdmissionMutation,
    deleteAdmissionMutation,
    resetAdmissionMutation,
  };
};
