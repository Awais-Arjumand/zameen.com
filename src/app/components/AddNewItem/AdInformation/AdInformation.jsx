"use client";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import IconAndLabel from "../LocationAndCity/IconAndLabel";
import { IoDocumentTextOutline } from "react-icons/io5";
import Select from "react-select";

const AdInformation = forwardRef((props, ref) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [buyOrRent, setBuyOrRent] = useState("");

  useImperativeHandle(ref, () => ({
    getData: () => ({
      title,
      description,
      category,
      buyOrRent,
    }),
  }));

  // react-select options
  const categoryOptions = [
    { value: "House", label: "House" },
    { value: "Apartment", label: "Apartment" },
    { value: "Villa", label: "Villa" },
    { value: "Land", label: "Land" },
  ];

  const buyOrRentOptions = [
    { value: "Buy", label: "Buy" },
    { value: "Rent", label: "Rent" },
  ];

  // Custom styles for react-select
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
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#1CC323" : "white",
      color: state.isSelected ? "white" : "black",
    }),
  };

  return (
    <div className="w-full h-fit roboto rounded-lg bg-white px-14 py-7">
      <div className="w-full h-fit flex flex-col gap-y-5">
        <IconAndLabel
          icon={<IoDocumentTextOutline className="text-xl text-white" />}
          label={"Ad Information"}
        />

        <div className="w-full h-fit flex flex-col gap-y-6">
          {/* Title Field */}
          <div className="w-full h-fit flex flex-col gap-y-3">
            <label className="text-xl font-semibold">Title</label>
            <input
              type="text"
              className="border border-gray-500 capitalize rounded px-3 py-2 w-full outline-none placeholder:text-sm text-sm"
              placeholder="Type Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description Field */}
          <div className="w-full h-fit flex flex-col gap-y-3">
            <label className="text-xl font-semibold">Description</label>
            <textarea
              className="border border-gray-500 w-full h-36 rounded capitalize px-3 py-2 outline-none placeholder:text-sm text-sm"
              placeholder="Type Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
<div className="w-full h-fit grid grid-cols-2 gap-x-3">
  
          {/* Category Field */}
          <div className="w-full h-fit flex flex-col gap-y-3">
            <label className="text-xl font-semibold">Category</label>
            <Select
              options={categoryOptions}
              value={categoryOptions.find((option) => option.value === category)}
              onChange={(selectedOption) => setCategory(selectedOption.value)}
              styles={customStyles}
              placeholder="Select Category"
              isSearchable={false}
              className="text-sm"
              instanceId="category-select"
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              menuPosition="fixed"
            />
          </div>

          {/* Buy/Rent Field */}
          <div className="w-full h-fit flex flex-col gap-y-3">
            <label className="text-xl font-semibold">Buy or Rent</label>
            <Select
              options={buyOrRentOptions}
              value={buyOrRentOptions.find(
                (option) => option.value === buyOrRent
              )}
              onChange={(selectedOption) => setBuyOrRent(selectedOption.value)}
              styles={customStyles}
              placeholder="Select Option"
              isSearchable={false}
              className="text-sm"
              instanceId="buy-rent-select"
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              menuPosition="fixed"
            />
          </div>
</div>
        </div>
      </div>
    </div>
  );
});

export default AdInformation;
