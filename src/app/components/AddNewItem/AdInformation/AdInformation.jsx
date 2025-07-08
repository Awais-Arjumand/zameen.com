import React, { forwardRef, useImperativeHandle, useState } from "react";
import IconAndLabel from "../LocationAndCity/IconAndLabel";
import { IoDocumentTextOutline } from "react-icons/io5";
import SelectionIconOrLabel from "../LocationAndCity/SelectionIconOrLabel";
import { MdDescription, MdTitle } from "react-icons/md";

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
      buyOrRent
    }),
  }));

  return (
    <div className="w-full h-fit rounded-lg bg-white px-14 py-7">
      <div className="w-full h-fit flex gap-x-14">
        <IconAndLabel
          icon={<IoDocumentTextOutline className="text-3xl text-gray-400" />}
          label={"Ad Information"}
        />
        <div className="w-full h-fit flex flex-col gap-y-6">
          {/* Title Field */}
          <div className="w-full h-fit flex flex-col gap-y-3">
            <SelectionIconOrLabel
              icon={<MdTitle className="text-xl text-gray-700" />}
              label={"Title"}
            />
            <input
              type="text"
              className="border border-gray-500 capitalize rounded px-3 py-2 w-full outline-1 outline-green-500 placeholder:text-sm text-sm"
              placeholder="Type Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description Field */}
          <div className="w-full h-fit flex flex-col gap-y-3">
            <SelectionIconOrLabel
              icon={<MdDescription className="text-xl text-gray-700" />}
              label={"Description"}
            />
            <textarea
              type="text"
              className="border border-gray-500 w-full h-36 rounded capitalize px-3 py-2 outline-1 outline-green-500 placeholder:text-sm text-sm"
              placeholder="Type Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Category Field */}
          <div className="w-full h-fit flex flex-col gap-y-3">
            <SelectionIconOrLabel
              icon={<MdTitle className="text-xl text-gray-700" />}
              label={"Category"}
            />
            <select
              className="border border-gray-500 rounded px-3 py-2 w-full outline-1 outline-green-500 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Land">Land</option>
            </select>
          </div>

          {/* Buy/Rent Field */}
          <div className="w-full h-fit flex flex-col gap-y-3">
            <SelectionIconOrLabel
              icon={<MdTitle className="text-xl text-gray-700" />}
              label={"Buy or Rent"}
            />
            <select
              className="border border-gray-500 rounded px-3 py-2 w-full outline-1 outline-green-500 text-sm"
              value={buyOrRent}
              onChange={(e) => setBuyOrRent(e.target.value)}
              required
            >
              <option value="">Select Option</option>
              <option value="Buy">Buy</option>
              <option value="Rent">Rent</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AdInformation;