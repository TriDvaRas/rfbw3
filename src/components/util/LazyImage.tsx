import React, { useEffect, useState } from 'react'
import NextImage from 'next/image'
import { set } from 'lodash'

type Props = {
    width: number
    height: number
    src: string
    alt: string
    className?: string
    imageClassName?: string
}

function LazyImage({ height, src, width, className, alt,imageClassName }: Props) {

    const [_width, setWidth] = useState(width)
    const [_height, setHeight] = useState(height)
    const customImgDimension = { width, height }
    const [imageLoadedState, setImageLoadedState] = useState<0 | 1 | 2>(0)
    useEffect(() => {
        setImageLoadedState(0)
    }, [src])

    return <div style={customImgDimension} className={`flex ${className} `}>
        {
            imageLoadedState == 0 && <NextImage quality={20} src={src} alt={alt} width={_width} height={_height} className={`min-w-full min-h-full object-cover blur ${imageClassName}`}
                onLoadingComplete={(e) => {
                    const containerMult = width / height
                    const naturalMult = e.naturalWidth / e.naturalHeight
                    if (naturalMult > containerMult) {
                        const reqH = _height * 1.3
                        const reqW = reqH * naturalMult
                        setHeight(reqH)
                        setWidth(reqW)
                        setImageLoadedState(1)
                    }
                    else {
                        const reqW = _width * 1.3
                        const reqH = reqW / naturalMult
                        setWidth(reqW)
                        setHeight(reqH)
                        setImageLoadedState(1)
                    }
                }} />
        }
        {
            imageLoadedState == 1 && <NextImage quality={90} src={src} alt={''} width={_width} height={_height} className={`min-w-full min-h-full object-cover blur ${imageClassName}`}
                onLoadingComplete={(e) => {
                    setImageLoadedState(2)
                }} />
        }
        {
            imageLoadedState == 2 && <NextImage quality={90} src={src} alt={''} width={_width} height={_height} className={`min-w-full min-h-full object-cover ${imageClassName}`} />
        }

        {/* <div className='absolute left-0 top-0'>{imageLoadedState}</div> */}
    </div>
}

export default LazyImage