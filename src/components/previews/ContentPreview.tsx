import React, { useRef } from 'react'
import { Button, RadialProgress } from 'react-daisyui'
import Avatar from '../util/Avatar'
import LazyImage from '../util/LazyImage'
import { useHover } from 'usehooks-ts'
import { RiPencilFill } from 'react-icons/ri'
import { MdDeleteForever } from 'react-icons/md'

type Props = {
    type: 'game' | 'movie' | 'anime'
    label: string
    imageUrl?: string
    authorImageUrl?: string
    isUploading?: boolean
    progress?: number
    onEdit?: () => void
    onDelete?: () => void
}

function ContentPreview({ type, authorImageUrl, imageUrl, isUploading, label, progress, onEdit, onDelete }: Props) {
    const hoverRef = useRef(null!)
    const isHover = useHover(hoverRef)
    return (
        <div ref={hoverRef} className="w-[260px] h-[390px] relative mb-12 bg-slate-800 rounded-2xl">
            <LazyImage src={imageUrl || '/errorAvatar.jpg'} alt="Ты не должен этого видеть. Перезалей картинку." width={260} height={390} className="object-cover h-full" imageClassName='rounded-xl' />
            {isUploading && typeof progress == 'number' && <div className='absolute top-0 w-full h-full bg-slate-900 bg-opacity-80 flex justify-center items-center'><RadialProgress value={progress}>{progress}%</RadialProgress></div>}
            {authorImageUrl && <Avatar size={40} src={authorImageUrl || '/errorAvatar.jpg'} className='absolute right-[-16px] top-[-16px]' shape='circle' />}
            {type == 'game' && <div className={`absolute overflow-clip left-[-25px] bottom-[-30px] w-[310px] h-[80px] rounded-full bg-opacity-100 bg-green-500 px-1 py-1  flex text-center align-middle items-center justify-center text-slate-200 ${label.length > 7 ? label.length > 12 ? label.length > 15 ? `text-3xl` : `text-4xl` : `text-5xl` : `text-6xl`}`} >{label || 'ЯЙЦА'}</div >}
            {type == 'movie' && <div className={`absolute overflow-clip left-[-25px] bottom-[-30px] w-[310px] h-[80px] rounded-full bg-opacity-100 bg-amber-500 px-1 py-1  flex text-center align-middle items-center justify-center text-slate-200 ${label.length > 7 ? label.length > 12 ? label.length > 15 ? `text-3xl` : `text-4xl` : `text-5xl` : `text-6xl`}`} >{label || 'ЯЙЦА'}</div >}
            {type == 'anime' && <div className={`absolute overflow-clip left-[-25px] bottom-[-30px] w-[310px] h-[80px] rounded-full bg-opacity-100 bg-pink-500 px-1 py-1  flex text-center align-middle items-center justify-center text-slate-200 ${label.length > 7 ? label.length > 12 ? label.length > 15 ? `text-3xl` : `text-4xl` : `text-5xl` : `text-6xl`}`} >{label || 'ЯЙЦА'}</div >}
            <div className='absolute right-0 top-0 flex flex-col gap-2 m-1.5'>
                {onEdit && isHover && <Button onClick={onEdit} shape='circle' className='' size='sm' color='info'><RiPencilFill className="text-slate-800 text-2xl" /></Button>}
                {onDelete && isHover && <Button onClick={onDelete} shape='circle' className='' size='sm' color='error'><MdDeleteForever className="text-slate-800 text-2xl " /></Button>}
            </div>
        </div>
    )
}

export default ContentPreview