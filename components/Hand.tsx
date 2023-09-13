import React from "react";

const cardStyle = {
  backgroundColor: "#cccccc",
  height: "84px",
  width: "60px",
  borderRadius: "5px",
  margin: "5px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0px 10px 10px -6px rgba(0, 0, 0, 0.3)",
  fontSize: "1.5rem",
  border: "none",
};
interface HandProps {
  value: string;
  onClick: (e: any, value: string) => void;
}
export const Hand = ({ value, onClick }: HandProps) => {
  return (
    <button style={cardStyle} onClick={(e) => onClick(e, value)}>
      {value}
    </button>
  );
};
