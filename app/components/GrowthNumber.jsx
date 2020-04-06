import React from "react";
import "./GrowthNumber.css";

const GrowthNumber = ({number, formatter}) => {
  const classList = number >= 0
    ? "u-positive-text u-positive-arrow"
    : "u-negative-text u-negative-arrow";
  return (
    number
      ? <span className={classList}>
        {formatter(number)}
      </span>
      : <span className="u-negative-text"></span>
  );
};

export default GrowthNumber;
