"use client";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import IconAndLabel from "../LocationAndCity/IconAndLabel";
import { RiCoinsLine } from "react-icons/ri";

import Select from "react-select";
import { FaRulerCombined } from "react-icons/fa6";
import { CiDollar } from "react-icons/ci";

const AreaAndPrice = forwardRef((props, ref) => {
  const [area, setArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("Marla");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("PKR");

  // Options for area unit
  const areaUnitOptions = [
    { value: "Marla", label: "Marla" },
    { value: "Kanal", label: "Kanal" },
  ];

  // Options for price unit
  const priceUnitOptions = [
    { value: "Lakh", label: "Lakh" },
    { value: "Crore", label: "Crore" },
    { value: "PKR", label: "PKR" },
  ];

  useImperativeHandle(ref, () => ({
    getData: () => ({
      area,
      areaUnit,
      minPrice,
      maxPrice,
      priceUnit,
    }),
  }));

  // Custom styles for react-select with full width
  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
    control: (provided) => ({
      ...provided,
      border: "1px solid #6b7280",
      borderRadius: "0.375rem",
      cursor: "pointer",
      minHeight: "42px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#6b7280",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#10b981" : "white",
      color: state.isSelected ? "white" : "black",
    }),
  };

  return (
    <div className="w-full h-fit rounded-lg roboto bg-white px-14 py-7">
      <div className="w-full h-fit flex flex-col gap-y-5">
        <IconAndLabel
          icon={<RiCoinsLine className="text-xl text-white" />}
          label={"Area and Price"}
        />

        <div className="w-full flex flex-col gap-y-3">
          {/* Area Section */}
          <div className="w-full flex flex-col gap-y-3 py-3">
          <div className="w-fit h-fit flex gap-x-3 items-center">

          <FaRulerCombined className="text-2xl"/>
            <label htmlFor="" className="text-xl font-semibold">
              Area Size
            </label>
          </div>

            <div className="w-full flex gap-x-2">
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full border border-gray-500 capitalize rounded px-3 py-2 outline-none placeholder:text-sm text-sm"
                placeholder="Enter Area"
              />
              <div className="w-32">
                <Select
                  options={areaUnitOptions}
                  value={areaUnitOptions.find(
                    (option) => option.value === areaUnit
                  )}
                  styles={customStyles}
                  className="text-sm"
                  isSearchable={false}
                  instanceId="area-unit-select"
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
                  menuPosition="fixed"
                  onChange={(selectedOption) =>
                    setAreaUnit(selectedOption.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="w-full flex flex-col gap-y-3 py-3">
            <div className="w-fit h-fit flex gap-x-3 items-center">
            <CiDollar className="text-2xl"/>

            <label htmlFor="" className="text-xl font-semibold">
              Price Range
            </label>
            </div>

            <div className="w-full flex flex-col gap-y-2">
              {/* Price Inputs Container */}
              <div className="w-full grid grid-cols-2 gap-x-3">
                {/* Min Price */}
                <div className="w-full flex flex-col gap-y-3">
                  <div className="w-full text-sm font-medium">Min Price:</div>
                  <input
                    type="text"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full border border-gray-500 capitalize rounded px-3 py-2.5 outline-none placeholder:text-sm text-sm"
                    placeholder="Enter Minimum Price"
                  />
                </div>

                {/* Max Price */}
                <div className="w-full flex flex-col gap-y-3">
                  <div className="w-full text-sm font-medium">Max Price:</div>
                  <input
                    type="text"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full border border-gray-500 capitalize rounded px-3 py-2.5 outline-none placeholder:text-sm text-sm"
                    placeholder="Enter Maximum Price"
                  />
                </div>
              </div>

              {/* Price Unit */}
              <div className="w-full flex flex-col gap-y-3 ">
                <div className="w-24 text-sm font-medium">Unit:</div>
                <div className="w-[49.5%]">
                  <Select
                    options={priceUnitOptions}
                    value={priceUnitOptions.find(
                      (option) => option.value === priceUnit
                    )}
                    styles={customStyles}
                    className="text-sm"
                    isSearchable={false}
                    instanceId="price-unit-select"
                    menuPortalTarget={
                      typeof document !== "undefined" ? document.body : null
                    }
                    menuPosition="fixed"
                    onChange={(selectedOption) =>
                      setPriceUnit(selectedOption.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AreaAndPrice;
