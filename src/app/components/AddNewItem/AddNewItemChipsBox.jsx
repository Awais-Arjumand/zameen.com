import React from 'react';

const AddNewItemChipsBox = ({ icon, label, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`w-fit h-fit py-1 px-4 cursor-pointer rounded-lg flex gap-x-3 justify-center items-center 
        ${isSelected ? 'bg-[#ddf6de] text-[#1CC323] border border-green-600' : 'bg-[#f5f5f5] text-gray-700'}`}>
      {icon}
      <h1 className='text-base font-normal'>{label}</h1>
    </div>
  );
};

export default AddNewItemChipsBox;
