"use client";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import IconAndLabel from "../LocationAndCity/IconAndLabel";
import { IoDocumentTextOutline } from "react-icons/io5";
import SelectionIconOrLabel from "../LocationAndCity/SelectionIconOrLabel";
import { GoImage } from "react-icons/go";
import { IoMdImages } from "react-icons/io";
import { MdOutlineVideoCall } from "react-icons/md";

const PropertyImagesandVideos = forwardRef((props, ref) => {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  useImperativeHandle(ref, () => ({
    getData: () => ({
      images,
      video
    })
  }));

  const handleImageClick = () => {
    if (images.length < 5) {
      imageInputRef.current.click();
    }
  };

  const handleImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = [...images, ...selectedFiles].slice(0, 5);
    setImages(totalFiles);
    e.target.value = "";
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleVideoClick = () => {
    if (!video) {
      videoInputRef.current.click();
    }
  };

  const handleVideoChange = (e) => {
    const selectedFile = e.target.files[0];
    setVideo(selectedFile);
    e.target.value = "";
  };

  const removeVideo = () => {
    setVideo(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const isImageDisabled = images.length >= 5;
  const isVideoDisabled = !!video;

  return (
    <div className="w-full h-fit rounded-lg bg-white px-14 py-7">
      <div className="w-full h-fit flex gap-x-14">
        <IconAndLabel
          icon={<IoDocumentTextOutline className="text-3xl text-gray-400" />}
          label={"Property Images and Videos"}
        />
        <div className="w-full h-fit flex flex-col">
          {/* IMAGES */}
          <div className="w-full h-fit flex flex-col gap-y-3 py-3">
            <SelectionIconOrLabel
              icon={<GoImage className="text-xl text-gray-700" />}
              label={"Images"}
            />
            <div className="w-full h-fit flex flex-col border border-dashed rounded-lg px-6 py-3 border-green-700">
              <div className="w-fit h-fit flex justify-center items-center mb-4">
                <button
                  type="button"
                  onClick={handleImageClick}
                  disabled={isImageDisabled}
                  className={`w-fit h-fit p-3 cursor-pointer transition-all duration-300 rounded-full flex gap-x-2 justify-center items-center ${
                    isImageDisabled
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#e7f3ef] hover:bg-gray-300"
                  }`}
                >
                  <IoMdImages
                    className={`text-2xl ${
                      isImageDisabled ? "text-gray-500" : "text-green-700"
                    }`}
                  />
                  <span
                    className={`${
                      isImageDisabled ? "text-gray-500" : "text-gray-700"
                    }`}
                  >
                    {isImageDisabled ? "Max 5 Images" : "Upload Image"}
                  </span>
                </button>
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImagesChange}
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                />
              </div>

              {/* IMAGE PREVIEWS */}
              <div className="flex flex-wrap gap-4">
                {images.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 border rounded overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`upload-${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 cursor-pointer bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {images.length === 0 && (
                  <span className="text-gray-500 text-sm">No images selected</span>
                )}
              </div>
            </div>
          </div>

          {/* VIDEO */}
          <div className="w-full h-fit flex flex-col gap-y-3 py-3">
            <SelectionIconOrLabel
              icon={<MdOutlineVideoCall className="text-xl text-gray-700" />}
              label={"Add Videos of your Property"}
            />
            <div className="w-full h-fit flex flex-col border border-dashed rounded-lg px-6 py-3 border-green-700">
              <div className="w-fit h-fit flex justify-center items-center mb-4">
                <button
                  type="button"
                  onClick={handleVideoClick}
                  disabled={isVideoDisabled}
                  className={`w-fit h-fit p-3 cursor-pointer transition-all duration-300 rounded-full flex gap-x-2 justify-center items-center ${
                    isVideoDisabled
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#e7f3ef] hover:bg-gray-300"
                  }`}
                >
                  <MdOutlineVideoCall
                    className={`text-2xl ${
                      isVideoDisabled ? "text-gray-500" : "text-green-700"
                    }`}
                  />
                  <span
                    className={`${
                      isVideoDisabled ? "text-gray-500" : "text-gray-700"
                    }`}
                  >
                    {isVideoDisabled ? "1 Video Uploaded" : "Upload Video"}
                  </span>
                </button>
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleVideoChange}
                  accept="video/*"
                  style={{ display: "none" }}
                />
              </div>

              {/* VIDEO PREVIEW */}
              <div className="flex flex-wrap gap-4">
                {video ? (
                  <div className="relative w-48 h-32 border rounded overflow-hidden">
                    <video
                      src={URL.createObjectURL(video)}
                      controls
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={removeVideo}
                      className="absolute top-1 right-1 cursor-pointer bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">No video selected</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PropertyImagesandVideos;