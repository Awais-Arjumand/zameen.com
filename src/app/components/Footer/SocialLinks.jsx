import React from 'react'

const SocialLinks = ({icon,bgColor}) => {
  return (
    <div className={`w-8  h-8 rounded-full ${bgColor} text-white flex justify-center items-center`}>
      {icon}
    </div>
  )
}

export default SocialLinks
