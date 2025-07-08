import React from 'react'

const IconAndLabel = ({icon,label}) => {
  return (
    <div className='w-fit h-fit  flex flex-col gap-y-3'>
        <div className='w-fit h-fit p-3 flex justify-center items-center rounded-xl bg-[#f7f7f7]'>

      {icon}
        </div>
      <h1 className='font-semibold text-base w-24'>{label}</h1>
    </div>
  )
}

export default IconAndLabel
