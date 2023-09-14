import { useQuery } from "react-query";
import { Deck } from "../types/";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const useQueryDeck = () => {
  const supabase = useSupabaseClient();
  const getDecks = async (): Promise<Deck[]> => {
    const { data, error } = await supabase
      .from("view_decks")
      .select()
      .order("card_id", { ascending: true });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  return useQuery<Deck[], Error>({
    queryKey: ["decks"],
    queryFn: getDecks,
    staleTime: Infinity,
  });
};
