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
};

const handleClick = (e: any, value: string) => {
  console.log("clicked: ", value);
};
interface HandProps {
  value: string;
  onClick: (e: any, value: string) => void;
}
export const Hand = ({ value }: HandProps) => {
  return <div style={cardStyle}>{value}</div>;
};
