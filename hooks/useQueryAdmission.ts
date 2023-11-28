import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "react-query";

import { AdmissionQueryKey } from "../lib";
import { Admission } from "../types";

const TABLE_NAME = "admissions" as const;

export const useQueryAdmission = () => {
  const supabase = useSupabaseClient();
  const getAdmissions = async (): Promise<Admission[]> => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  return useQuery<Admission[], Error>({
    queryKey: [AdmissionQueryKey],
    queryFn: getAdmissions,
    staleTime: Infinity,
  });
};
