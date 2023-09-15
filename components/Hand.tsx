import React from "react";

const commonStyle = {
  height: "84px",
  width: "60px",
  borderRadius: "5px",
  margin: "5px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0px 10px 10px -6px rgba(0, 0, 0, 0.3)",
  fontSize: "1.5rem",
};

const cardStyle = {
  ...commonStyle,
  border: "0.5px solid #cccccc",
};

const selectedCardStyle = {
  ...commonStyle,
  border: "1px solid tomato",
  position: "relative",
  bottom: 15,
};

interface HandProps {
  value: string;
  selected: boolean;
  onClick: (e: any, value: string) => void;
}
export const Hand = ({ value, selected, onClick }: HandProps) => {
  return (
    <button
      style={selected ? selectedCardStyle : cardStyle}
      onClick={(e) => onClick(e, value)}
    >
      {value}
    </button>
  );
};
