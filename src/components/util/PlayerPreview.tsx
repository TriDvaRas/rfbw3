import React from 'react'
import { getNameInitials } from '../../utils/text'
import { Avatar, RadialProgress } from 'react-daisyui'

type Props = {
  name: string
  motto: string
  imageUrl?: string
  isUploading?: boolean
  progress?: number
  className?: string
}

function PlayerPreview({ motto, name, imageUrl, isUploading, progress, className = '' }: Props) {
  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <div className="relative">
        <Avatar size={256} shape={'circle'} letters={getNameInitials(name)} src={imageUrl} className="text-7xl" />
        {isUploading && typeof progress == 'number' && <div className='absolute top-0 mask mask-circle w-full h-full bg-slate-900 bg-opacity-80 flex justify-center items-center'><RadialProgress value={progress}>{progress}%</RadialProgress></div>}
      </div>
      <h3 className="text-3xl font-bold mt-2 mb-0">{name}</h3>
      <h5 className="text-lg font-thin mt-0 mb-5">{motto}</h5>
    </div>
  )
}

export default PlayerPreview