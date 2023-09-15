export type Room = {
  id: string;
  created_at: string;
  owner_id?: string;
  name: string;
  status: "Up" | "Down";
  deck_id: number;
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

export type Deck = {
  deck_id: number;
  name: string;
  card_id: number;
  value: string;
  order_no: number;
  color: string;
};
