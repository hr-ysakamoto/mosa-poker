export type Room = {
  id: string;
  created_at: string;
  owner_id?: string;
  name: string;
  status: "Up" | "Down";
};

export type EditedRoom = {
  name: string;
};

export type Profile = {
  id: string;
  created_at: string;
  user_name: string;
  avatar_url?: string;
};

export type EditedProfile = {
  user_name: string;
  avatar_url?: string;
};

export type Admission = {
  id: string;
  created_at: string;
  user_id: string;
  room_id: string;
  card: string;
};
