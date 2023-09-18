import { Stack, Typography } from "@mui/material";
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
const placedStyle = { boxShadow: "0px 10px 10px -6px rgba(0, 0, 0, 0.3)" };

const upStyle = {
  ...common,
  ...placedStyle,
};
const downStyle = {
  ...common,
  ...placedStyle,
  border: "1px solid #bbbbbb",
  backgroundColor: "#cccccc",
};
const notPlacedStyle = {
  ...common,
  border: "1px dashed #dddddd",
  backgroundColor: "transparent",
};

const getStyle = (isFaceUp: boolean, isPlaced: boolean, color: string) => {
  if (!isPlaced) return notPlacedStyle;
  return isFaceUp ? { ...upStyle, backgroundColor: color } : downStyle;
};

interface CardSlotProps {
  isFaceUp: boolean;
  isPlaced: boolean;
  isLoginUser: boolean;
  name: string;
  value: string;
  color: string;
}

export const CardSlot = ({
  isFaceUp,
  isPlaced,
  isLoginUser,
  name,
  value,
  color,
}: CardSlotProps) => {
  const targetStyle = getStyle(isFaceUp, isPlaced, color);
  return (
    <>
      <Stack direction="column" alignItems="center">
        <div style={targetStyle}>{isFaceUp && <p>{value}</p>}</div>
        {isLoginUser ? (
          <Typography
            style={{
              marginTop: 5,
              textAlign: "center",
              fontSize: 15,
              overflowWrap: "break-word",
              wordBreak: "break-word",
              width: "80px",
            }}
          >
            {name}
          </Typography>
        ) : (
          <p
            style={{
              marginTop: 5,
              textAlign: "center",
              fontSize: 15,
              overflowWrap: "break-word",
              wordBreak: "break-word",
              width: "80px",
            }}
          >
            {name}
          </p>
        )}
      </Stack>
    </>
  );
};
