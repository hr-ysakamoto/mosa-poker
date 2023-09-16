import { useQuery } from "react-query";
import { Deck } from "../types/";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { DeckQueryKey } from "../lib";

const VIEW_NAME = "view_decks" as const;

export const useQueryDeck = () => {
  const supabase = useSupabaseClient();
  const getDecks = async (): Promise<Deck[]> => {
    const { data, error } = await supabase
      .from(VIEW_NAME)
      .select()
      .order("card_id", { ascending: true });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  return useQuery<Deck[], Error>({
    queryKey: [DeckQueryKey],
    queryFn: getDecks,
    staleTime: Infinity,
  });
};
