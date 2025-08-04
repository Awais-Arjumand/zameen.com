import React from 'react'

const IconAndLabel = ({icon,label}) => {
  return (
    <div className='w-fit h-fit flex gap-x-3 items-center'>
        <div className='w-fit h-fit p-3 flex justify-center items-center rounded-xl bg-primary'>
          {icon}
        </div>
      <h1 className='font-semibold text-2xl'>{label}</h1>
    </div>
  )
}

export default IconAndLabel