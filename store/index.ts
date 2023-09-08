import { create } from "zustand";
import { Session } from "@supabase/supabase-js";
import { EditedRoom } from "../types";

type State = {
  session: Session | null;
  setSession: (payload: Session | null) => void;
  editedRoom: EditedRoom;
  updateEditedRoom: (payload: EditedRoom) => void;
  resetEditedRoom: () => void;
};
const useStore = create<State>((set) => ({
  session: null,
  setSession: (payload) => set({ session: payload }),
  editedRoom: { name: "" },
  updateEditedRoom: (payload) => set({ editedRoom: { ...payload } }),
  resetEditedRoom: () => set({ editedRoom: { name: "" } }),
}));

export default useStore;
