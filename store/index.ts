import { create } from "zustand";
import { EditedProfile, EditedRoom } from "../types";

type State = {
  editedRoom: EditedRoom;
  updateEditedRoom: (payload: EditedRoom) => void;
  resetEditedRoom: () => void;
  editedProfile: EditedProfile;
  updateEditedProfile: (payload: EditedProfile) => void;
  resetEditedProfile: () => void;
};
const useStore = create<State>((set) => ({
  editedRoom: { name: "" },
  updateEditedRoom: (payload) => set({ editedRoom: { ...payload } }),
  resetEditedRoom: () => set({ editedRoom: { name: "" } }),
  editedProfile: { user_name: "", avatar_url: "" },
  updateEditedProfile: (payload) => set({ editedProfile: { ...payload } }),
  resetEditedProfile: () =>
    set({ editedProfile: { user_name: "", avatar_url: "" } }),
}));

export default useStore;
