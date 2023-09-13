import { Stack } from "@mui/material";
import React from "react";

const common = {
  fontSize: "30px",
  height: "112px",
  width: "80px",
  borderRadius: "8px",
  margin: "5px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const upStyle = {
  ...common,
  border: "1px solid skyblue",
  backgroundColor: "#afeeee",
  boxShadow: "0px 10px 10px -6px rgba(0, 0, 0, 0.3)",
};
const downStyle = {
  ...common,
  border: "1px solid #bbbbbb",
  backgroundColor: "#cccccc",
  boxShadow: "0px 10px 10px -6px rgba(0, 0, 0, 0.3)",
};
const notPlacedStyle = {
  ...common,
  border: "1px dashed #cccccc",
  backgroundColor: "#fcfcfc",
};

const getStyle = (isFaceUp: boolean, isPlaced: boolean) => {
  if (!isPlaced) return notPlacedStyle;
  return isFaceUp ? upStyle : downStyle;
};

interface CardSlotProps {
  isFaceUp: boolean;
  isPlaced: boolean;
  name: string;
  value: string;
}

export const CardSlot = ({
  isFaceUp,
  isPlaced,
  name,
  value,
}: CardSlotProps) => {
  const targetStyle = getStyle(isFaceUp, isPlaced);
  return (
    <>
      <Stack direction="column">
        <div style={targetStyle}>{isFaceUp && <p>{value}</p>}</div>
        <p style={{ marginTop: 5, textAlign: "center", fontSize: 15 }}>
          {name}
        </p>
      </Stack>
    </>
  );
};
