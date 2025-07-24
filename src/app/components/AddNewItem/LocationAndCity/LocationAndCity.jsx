"use client";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import IconAndLabel from "../LocationAndCity/IconAndLabel";
import { CiCircleCheck, CiLocationOn } from "react-icons/ci";
import SelectionIconOrLabel from "../LocationAndCity/SelectionIconOrLabel";
import AddNewItemChipsBox from "../AddNewItemChipsBox";
import { BsFillHouseAddFill } from "react-icons/bs";
import {
  FaHouseMedicalCircleExclamation,
  FaMapLocation,
} from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi";
import { TbBuildings } from "react-icons/tb";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { PiBuildingOfficeBold, PiFarm, PiBuildingsBold, PiFarmLight } from "react-icons/pi";
import { MdOutlineDoorBack } from "react-icons/md";
import { GiFarmTractor } from "react-icons/gi";
import { MdFactory } from "react-icons/md";
import {
  FaFileInvoice,
  FaShop,
  FaWarehouse,
  FaBuilding,
  FaIndustry,
} from "react-icons/fa6";
import { TbBuildingWarehouse } from "react-icons/tb";

const PurposeData = [
  { icon: <BsFillHouseAddFill />, label: "Sell" },
  { icon: <FaHouseMedicalCircleExclamation />, label: "Rent" },
];
const PropertyTypeTabs = ["Home", "Plots", "Commercial"];
const ChipsData = {
  Home: [
    { icon: <BiBuildingHouse />, label: "House" },
    { icon: <TbBuildings />, label: "Flat" },
    { icon: <HiOutlineBuildingOffice />, label: "Upper Portion" },
    { icon: <PiBuildingOfficeBold />, label: "Lower Portion" },
    { icon: <PiFarm />, label: "Farm House" },
    { icon: <MdOutlineDoorBack />, label: "Room" },
  ],
  Plots: [
    { icon: <PiBuildingsBold />, label: "Residential Plot" },
    { icon: <FaFileInvoice />, label: "Commercial Plot" },
    { icon: <GiFarmTractor />, label: "Agricultural Land" },
    { icon: <FaIndustry />, label: "Industrial Land" },
    { icon: <PiFarmLight  />, label: "Plot File" },
    { icon: <PiFarmLight  />, label: "Plot Form" },
  ],
  Commercial: [
    { icon: <HiOutlineBuildingOffice />, label: "Office" },
    { icon: <FaShop />, label: "Shop" },
    { icon: <FaWarehouse />, label: "Warehouse" },
    { icon: <MdFactory />, label: "Factory" },
    { icon: <FaBuilding />, label: "Building" },
    { icon: <TbBuildingWarehouse />, label: "Other..." },
  ],
};

const LocationAndCity = forwardRef((props, ref) => {
  const [topSelectedPurpose, setTopSelectedPurpose] = useState(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState("Home");
  const [selectedChips, setSelectedChips] = useState({
    Home: null,
    Plots: null,
    Commercial: null,
  });
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");

  useImperativeHandle(ref, () => ({
    getData: () => ({
      purpose: topSelectedPurpose,
      propertyType: selectedPropertyType,
      propertySubType: selectedChips[selectedPropertyType],
      city,
      location,
    }),
    setData: (data) => {
      setTopSelectedPurpose(data.purpose || null);
      setSelectedPropertyType(data.propertyType || "Home");
      setSelectedChips((prev) => ({
        ...prev,
        [data.propertyType || "Home"]: data.propertySubType || null,
      }));
      setCity(data.city || "");
      setLocation(data.location || "");
    },
  }));

  const handleTopClick = (label) => setTopSelectedPurpose(label);
  const handleChipClick = (tab, label) =>
    setSelectedChips((prev) => ({ ...prev, [tab]: label }));

  return (
    <div className="w-full h-fit roboto rounded-lg bg-white px-14 py-7">
      <div className="w-full h-fit flex flex-col gap-x-14 ">
        <IconAndLabel
          icon={<CiLocationOn className="text-xl text-[#1CC323]" />}
          label={"Location and Purpose"}
        />
        <div className="w-fit h-fit flex flex-col gap-y-3">
          <div className="w-full h-fit flex flex-col gap-y-3 py-3">
            <label htmlFor="" className="text-xl font-semibold">Select Purpose</label>
           
            <div className="w-fit h-fit flex gap-x-3">
              {PurposeData.map((item, index) => (
                <AddNewItemChipsBox
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  isSelected={topSelectedPurpose === item.label}
                  onClick={() => handleTopClick(item.label)}
                />
              ))}
            </div>
          </div>

          <div className="w-full h-fit flex flex-col gap-y-3 py-3">
            <label htmlFor="" className="text-xl font-semibold">Select Property Type</label>
         
            <div className="w-full h-fit flex items-center gap-x-4">
              {PropertyTypeTabs.map((tab, index) => (
                <h1
                  key={index}
                  onClick={() => setSelectedPropertyType(tab)}
                  className={`text-sm cursor-pointer font-normal px-2 pb-2 ${
                    selectedPropertyType === tab
                      ? "text-[#1CC323] border-b-3 border-[#1CC323] font-bold"
                      : "text-gray-600 border-b-2 border-transparent"
                  }`}
                >
                  {tab}
                </h1>
              ))}
            </div>

            <div className="w-fit h-fit flex flex-wrap gap-3 mt-2">
              {ChipsData[selectedPropertyType].map((item, index) => (
                <AddNewItemChipsBox
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  isSelected={
                    selectedChips[selectedPropertyType] === item.label
                  }
                  onClick={() =>
                    handleChipClick(selectedPropertyType, item.label)
                  }
                />
              ))}
            </div>
          </div>

          <div className="w-full h-fit flex flex-col gap-y-3 py-3">
            <label htmlFor="" className="text-xl font-semibold">City</label>
          
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-500 capitalize rounded px-3 py-2 outline-none placeholder:text-sm text-sm"
              placeholder="Type City"
            />
          </div>
          <div className="w-full h-fit flex flex-col gap-y-3 py-3">
            <label htmlFor="" className="text-xl font-semibold">Location</label>
          
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-500 rounded capitalize px-3 py-2 outline-none placeholder:text-sm text-sm"
              placeholder="Type Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default LocationAndCity;
