import React from 'react';

const AddNewItemChipsBox = ({ icon, label, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`w-fit h-fit py-1 px-3 cursor-pointer rounded-2xl flex gap-x-3 justify-center items-center 
        ${isSelected ? 'bg-green-100 text-green-600 border border-green-600' : 'bg-[#f5f5f5] text-gray-700'}`}>
      {icon}
      <h1 className='text-base font-medium'>{label}</h1>
    </div>
  );
};

export default AddNewItemChipsBox;
