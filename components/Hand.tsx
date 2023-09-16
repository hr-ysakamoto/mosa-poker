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
  border: "2px solid #556bd6",
  position: "relative",
  bottom: 15,
};

interface HandProps {
  value: string;
  selected: boolean;
  onClick: (e: any, value: string) => void;
  color: string;
}
export const Hand = ({ value, selected, onClick, color }: HandProps) => {
  const target = selected ? selectedCardStyle : cardStyle;
  const style = { ...target, backgroundColor: color };
  return (
    <button style={style} onClick={(e) => onClick(e, value)}>
      {value}
    </button>
  );
};
