import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CurtainsIcon from "@mui/icons-material/Curtains";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useStore from "../../store";
import { useQueryRoom } from "../../hooks/useQueryRoom";
import { useQueryAdmission } from "../../hooks/useQueryAdmission";
import { useQueryDeck } from "../../hooks/useQueryDeck";
import { useSubscribeRoom } from "../../hooks/useSubscribeRoom";
import { useMutateAdmission } from "../../hooks/useMutateAdmission";
import { useMutateRoom } from "../../hooks/useMutateRoom";
import { useSubscribeAdmissions } from "../../hooks/useSubscribeAdmissions";
import { CardSlot, Hand } from "../../components";
import { SignOutButton } from "../../components/SignOutButton";
import { Room } from "../../types";

export default function RoomPage() {
  const router = useRouter();
  const roomId = useStore((state) => state.currentRoomId);
  const updateRoom = useStore((state) => state.setCurrentRoomId);
  const user = useUser();
  const [room, setRoom] = useState<Room>();
  const [open, setOpen] = useState<boolean>(false);
  const {
    updateAdmissionMutation,
    deleteAdmissionMutation,
    resetAdmissionMutation,
  } = useMutateAdmission();
  const { updateRoomMutation } = useMutateRoom();

  const { data: rooms } = useQueryRoom();
  const { data: admissions } = useQueryAdmission();
  const { data: decks } = useQueryDeck();

  useSubscribeRoom(roomId!);
  useSubscribeAdmissions(roomId!);

  useEffect(() => {
    if (admissions && user && router.isReady && !roomId) {
      const currentRoomId = String(router.query.roomId);
      // ログインユーザーの入室情報を取得
      const loginUser = admissions.find(
        (admission) =>
          admission.user_id === user.id && admission.room_id === currentRoomId
      );
      // リロードなどでの再入場とみなし、storeにセット
      if (loginUser) {
        updateRoom(currentRoomId);
      } else {
        // 入室情報がない場合、招待リンク経由とみなす
        router.replace(`/lobby?invite=${currentRoomId}`);
      }
    }
  }, [router, user, admissions, roomId, updateRoom]);

  useEffect(() => {
    if (rooms && roomId) {
      const room = rooms.find((room) => room.id === roomId);
      setRoom(room);
    }
  }, [rooms, roomId]);

  const handleExitClick = async (e: any) => {
    e.preventDefault();
    await deleteAdmissionMutation.mutateAsync(user!.id);
    router.push("/lobby");
  };

  const handleRevealClick = async (e: any) => {
    e.preventDefault();
    await updateRoomMutation.mutateAsync({
      id: roomId!,
      created_at: room?.created_at || "",
      name: room?.name || "",
      owner_id: room?.owner_id || "",
      status: "Up",
      deck_id: room?.deck_id || 1,
    });
  };

  const handleResetClick = async (e: any) => {
    e.preventDefault();
    await updateRoomMutation.mutateAsync({
      id: roomId!,
      created_at: room?.created_at || "",
      name: room?.name || "",
      owner_id: room?.owner_id || "",
      status: "Down",
      deck_id: room?.deck_id || 1,
    });
    resetAdmissionMutation.mutateAsync(roomId!);
  };

  const handleHandClick = async (e: any, value: string) => {
    e.preventDefault();
    const target = admissions?.find(
      (admission) =>
        admission.user_id === user?.id && admission.room_id === roomId
    );
    await updateAdmissionMutation.mutateAsync({
      id: target?.id!,
      created_at: room?.created_at || "",
      user_id: user?.id || "",
      room_id: room?.id || "",
      card: value,
    });
  };

  const handleCopyToClipBoardClick = async (e: any) => {
    e.preventDefault();
    setOpen(true);
    await global.navigator.clipboard.writeText(
      `${window.location.origin}/room/${roomId}`
    );
  };
  const handleCloseSnackbar = (
    _: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // TODO: useQueryに置き換える
  const userProfiles = [
    { id: "9bf2e07f-e5f8-46db-8d62-fced65643455", name: "Yuki" },
    { id: "55ac9087-321e-451f-b964-2f9e9d72cccf", name: "mossari" },
  ];

  const loginUserSession = admissions?.find(
    (admission) =>
      admission.room_id === roomId && admission.user_id === user?.id
  );

  const cardSet = decks?.filter((deck) => deck.deck_id === room?.deck_id);

  return (
    room &&
    cardSet && (
      <Stack alignItems="center">
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyToClipBoardClick}
          >
            COPY LINK
          </Button>
          <Button startIcon={<MeetingRoomIcon />} onClick={handleExitClick}>
            EXIT
          </Button>
          <SignOutButton />
        </Stack>
        <Typography sx={{ py: 5 }} variant="h4">
          {room?.name || "Loading..."}
        </Typography>
        <Stack
          sx={{ pb: 1 }}
          spacing={2}
          direction="row"
          justifyContent="center"
        >
          <Button
            variant="outlined"
            size="large"
            startIcon={<CurtainsIcon />}
            disabled={
              !admissions
                ?.filter((admissinon) => admissinon.room_id === roomId)
                .every((admission) => admission.card !== "")
            }
            onClick={handleRevealClick}
          >
            REVEAL
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<RestartAltIcon />}
            onClick={handleResetClick}
          >
            RESET
          </Button>
        </Stack>
        <Box sx={{ py: 6 }}>
          <Stack direction="row" justifyContent="center">
            {admissions
              ?.sort((a, b) => (a.id > b.id ? 1 : -1))
              .flatMap((admission) => {
                if (admission.room_id !== roomId) return [];
                const userProfile = userProfiles.find(
                  (profile) => profile.id === admission.user_id
                );
                const color = cardSet.find(
                  (x) => x.value === admission.card
                )?.color;
                return (
                  <CardSlot
                    key={admission.id}
                    isFaceUp={room?.status === "Up"}
                    isPlaced={admission.card !== ""}
                    isLoginUser={admission.user_id === user?.id}
                    name={userProfile?.name || ""}
                    value={admission.card || ""}
                    color={color || "#eeeeee"}
                  />
                );
              })}
          </Stack>
        </Box>
        <Stack direction="row" justifyContent="center">
          {cardSet?.map((card) => (
            <Hand
              key={card.card_id}
              value={card.value.toString()}
              selected={loginUserSession?.card === card.value}
              onClick={(e) => handleHandClick(e, card.value.toString())}
            />
          ))}
        </Stack>
        <Typography sx={{ py: 3 }} variant="body1">
          Your choice:
          {loginUserSession?.card || " None"}
        </Typography>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            copied to clipboard!
          </Alert>
        </Snackbar>
      </Stack>
    )
  );
}
