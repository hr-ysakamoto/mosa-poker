import { create } from "zustand";
import { Session } from "@supabase/supabase-js";
import { EditedRoom } from "../types";

type State = {
  editedRoom: EditedRoom;
  updateEditedRoom: (payload: EditedRoom) => void;
  resetEditedRoom: () => void;
};
const useStore = create<State>((set) => ({
  editedRoom: { name: "" },
  updateEditedRoom: (payload) => set({ editedRoom: { ...payload } }),
  resetEditedRoom: () => set({ editedRoom: { name: "" } }),
}));

export default useStore;
