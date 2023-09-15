import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { SignOutButton } from "./SignOutButton";
import { DEFAULT_DECK_ID } from "../lib";
import useStore from "../store";
import { useMutateRoom } from "../hooks/useMutateRoom";
import { v4 } from "uuid";
import { useUser } from "@supabase/auth-helpers-react";
import { useMutateAdmission } from "../hooks/useMutateAdmission";
import { useRouter } from "next/router";
import { useQueryDeck } from "../hooks/useQueryDeck";
import { groupBy } from "../lib/aggregate";
import { Deck } from "../types";

interface CreateRoomFormProps {}

export const CreateRoomForm = ({}: CreateRoomFormProps) => {
  const editedRoom = useStore((state) => state.editedRoom);
  const updateRoom = useStore((state) => state.setCurrentRoomId);
  const updateEditedRoom = useStore((state) => state.updateEditedRoom);
  const [deckId, setDeckId] = useState<string>(DEFAULT_DECK_ID);
  const { createRoomMutation } = useMutateRoom();
  const { createAdmissionMutation } = useMutateAdmission();
  const user = useUser();
  const router = useRouter();
  const { data: decks } = useQueryDeck();
  const cardSet = groupBy(decks || [], (deck) => deck.deck_id);

  const handleCardSetChange = (e: SelectChangeEvent) => {
    setDeckId(e.target.value);
  };

  const handleCreateClick = async (e: any) => {
    e.preventDefault();
    if (!deckId) return;
    const uuid = v4();
    await createRoomMutation.mutateAsync({
      ...editedRoom,
      id: uuid,
      owner_id: user?.id,
      status: "Down",
      deck_id: Number(deckId),
    });
    await createAdmissionMutation.mutateAsync({
      user_id: user!.id,
      room_id: uuid,
      card: "",
    });
    updateRoom(uuid);
    router.push(`/room/${uuid}`);
  };

  /**
   * カードセットのタイトルを取得する
   * @param tuple [deck_id, Deck[]]
   * @returns
   */
  const getVotingSystemTitle = (tuple: [number, Deck[]]) => {
    return `${tuple[1][0].name} (${tuple[1]
      .map((card) => card.value)
      .join(", ")})`;
  };

  return (
    <>
      <TextField
        sx={{ pb: 3 }}
        id="outlined-basic"
        label="Room's name"
        variant="outlined"
        value={editedRoom.name}
        onChange={(e) =>
          updateEditedRoom({ ...editedRoom, name: e.target.value })
        }
      />
      <FormControl>
        <InputLabel>Voting System</InputLabel>
        <Select
          value={deckId}
          label="Voting System"
          onChange={handleCardSetChange}
        >
          {cardSet?.map((deck) => (
            <MenuItem key={deck[0]} value={deck[0]}>
              {getVotingSystemTitle(deck)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
        <Button
          variant="contained"
          size="large"
          onClick={handleCreateClick}
          disabled={!editedRoom.name || !deckId}
        >
          CREATE
        </Button>
        <SignOutButton />
      </Stack>
    </>
  );
};
