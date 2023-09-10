export type Room = {
  id: string;
  created_at: string;
  owner_id?: string;
  name: string;
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
