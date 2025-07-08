import React from 'react'

const SelectionIconOrLabel = ({icon,label}) => {
  return (
    <div className='w-fit h-fit flex gap-x-3 items-center'>
      <div className='w-fit h-fit flex justify-center p-2 items-center rounded-full bg-[#f7f7f7]'>
        {icon}
      </div>
      <h1 className='text-base font-semibold'>{label}</h1>
    </div>
  )
}

export default SelectionIconOrLabel
