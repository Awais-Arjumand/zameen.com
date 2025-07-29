import React from "react";

const HousesBoxesButtonIcons = ({
  textColor,
  fontWeight,
  icon,
  label,
  bgColor,
  bgColorHover,
}) => {
  return (
    <div
      className={`w-full h-fit p-2 px-3 ${bgColorHover} transition-all duration-300 border border-green-500 rounded-lg cursor-pointer flex justify-center items-center ${bgColor}`}
    >
      <h1
        className={`text-base flex items-center gap-x-1 ${textColor} ${fontWeight}`}
      >
        <span> {icon}</span>
        {label}
      </h1>
    </div>
  );
};

export default HousesBoxesButtonIcons;
