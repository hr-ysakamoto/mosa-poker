export type Room = {
  id: string;
  created_at: string;
  owner_id?: string;
  name: string;
};

export type EditedRoom = {
  name: string;
};
