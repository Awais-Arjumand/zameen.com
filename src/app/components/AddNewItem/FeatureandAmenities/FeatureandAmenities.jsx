"use client";
import React, { useState, forwardRef, useImperativeHandle } from "react";
import IconAndLabel from "../LocationAndCity/IconAndLabel";
import { IoBed, IoHomeOutline } from "react-icons/io5";
import { FaSink } from "react-icons/fa6";
import SelectionIconOrLabel from "../LocationAndCity/SelectionIconOrLabel";
import AddNewItemChipsBox from "../AddNewItemChipsBox";

const BedroomsData = [
  { icon: "", label: "Studio" },
  { icon: "", label: "1" },
  { icon: "", label: "2" },
  { icon: "", label: "3" },
  { icon: "", label: "4" },
  { icon: "", label: "5" },
  { icon: "", label: "6" },
  { icon: "", label: "7" },
  { icon: "", label: "8" },
  { icon: "", label: "9" },
  { icon: "", label: "10" },
  { icon: "", label: "10+" },
];

const BathroomsData = [
  { icon: "", label: "1" },
  { icon: "", label: "2" },
  { icon: "", label: "3" },
  { icon: "", label: "4" },
  { icon: "", label: "5" },
  { icon: "", label: "6" },
  { icon: "", label: "6+" },
];

const FeatureandAmenities = forwardRef((props, ref) => {
  const [selectedBedroom, setSelectedBedroom] = useState(null);
  const [selectedBathroom, setSelectedBathroom] = useState(null);

  useImperativeHandle(ref, () => ({
    getData: () => ({
      bedrooms: selectedBedroom,
      bathrooms: selectedBathroom,
    }),
  }));

  const handleBedroomClick = (label) => {
    setSelectedBedroom(label);
    console.log("Selected Bedroom:", label);
  };

  const handleBathroomClick = (label) => {
    setSelectedBathroom(label);
    console.log("Selected Bathroom:", label);
  };

  return (
    <div className="w-full h-fit rounded-lg bg-white px-14 py-7">
      <div className="w-full h-fit flex gap-x-14">
        <IconAndLabel
          icon={<IoHomeOutline className="text-3xl text-gray-400" />}
          label={"Feature and Amenities"}
        />
        <div className="w-fit h-fit flex flex-col">
          <div className="w-full flex flex-col gap-y-3 py-3">
            <SelectionIconOrLabel
              icon={<IoBed className="text-xl text-gray-700" />}
              label={"Bedrooms"}
            />
            <div className="w-fit h-fit flex gap-x-3 flex-wrap">
              {BedroomsData.map((item, index) => (
                <AddNewItemChipsBox
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  isSelected={selectedBedroom === item.label}
                  onClick={() => handleBedroomClick(item.label)}
                />
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col gap-y-3 py-3">
            <SelectionIconOrLabel
              icon={<FaSink className="text-xl text-gray-700" />}
              label={"Bathrooms"}
            />
            <div className="w-fit h-fit flex gap-x-3 flex-wrap">
              {BathroomsData.map((item, index) => (
                <AddNewItemChipsBox
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  isSelected={selectedBathroom === item.label}
                  onClick={() => handleBathroomClick(item.label)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FeatureandAmenities;
