import { Stack } from "@mui/material";
import React from "react";

const common = {
  backgroundColor: "#cccccc",
  fontSize: "30px",
  height: "112px",
  width: "80px",
  borderRadius: "8px",
  margin: "5px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0px 10px 10px -6px rgba(0, 0, 0, 0.3)",
};
const up = {
  ...common,
  backgroundColor: "#afeeee",
};
const down = {
  ...common,
  backgroundColor: "#cccccc",
};

interface CardSlotProps {
  state: "up" | "down";
  name: string;
  value: string;
}

export const CardSlot = ({ state, name, value }: CardSlotProps) => {
  return (
    <>
      <Stack direction="column">
        <div style={state === "up" ? up : down}>
          {state === "up" ? value : ""}
        </div>
        <p style={{ margin: 0, textAlign: "center", fontSize: 15 }}>{name}</p>
      </Stack>
    </>
  );
};
