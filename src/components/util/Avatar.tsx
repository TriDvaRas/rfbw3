import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

import AvatarGroup from './AvatarGroup'

import {
  IComponentBaseProps,
  ComponentColor,
  ComponentShape,
  ComponentSize,
} from 'react-daisyui/dist/types'
import Image from 'next/image'
import { Mask } from 'react-daisyui'
import { set } from 'lodash'

export type AvatarProps = React.HTMLAttributes<HTMLDivElement> &
  IComponentBaseProps & {
    size: number
    src?: string | null
    letters?: string
    shape?: ComponentShape
    color?: ComponentColor
    border?: boolean
    borderColor?: ComponentColor
    online?: boolean
    offline?: boolean
    children?: React.ReactNode
    imageClassName?: string
  }
export const isSingleStringChild = (children?: React.ReactNode) => {
  return (
    children &&
    React.Children.count(children) === 1 &&
    React.isValidElement(children) &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    typeof children.props.children === 'string'
  )
}
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  function Avatar({
    size,
    src,
    letters,
    shape,
    color,
    border,
    borderColor,
    online,
    offline,
    dataTheme,
    className,
    children,
    imageClassName,
    ...props
  }, ref): JSX.Element {
    const containerClasses = twMerge(
      'avatar',
      className,
      clsx({
        online: online,
        offline: offline,
        placeholder: !src,
      })
    )

    const imgClasses = clsx({
      'ring ring-offset-base-100 ring-offset-2': border,
      'ring-accent': borderColor === 'accent',
      'ring-error': borderColor === 'error',
      'ring-ghost': borderColor === 'ghost',
      'ring-info': borderColor === 'info',
      'ring-primary': borderColor === 'primary',
      'ring-secondary': borderColor === 'secondary',
      'ring-success': borderColor === 'success',
      'ring-warning': borderColor === 'warning',
      'rounded-btn': shape === 'square',
      'rounded-full': shape === 'circle',
    })

    const placeholderClasses = clsx({
      'bg-neutral-focus': !color,
      'text-neutral-content': !color,
      'bg-accent': color === 'accent',
      'bg-error': color === 'error',
      'bg-ghost': color === 'ghost',
      'bg-info': color === 'info',
      'bg-primary': color === 'primary',
      'bg-secondary': color === 'secondary',
      'bg-success': color === 'success',
      'bg-warning': color === 'warning',
      'text-accent-content': color === 'accent',
      'text-error-content': color === 'error',
      'text-ghost-content': color === 'ghost',
      'text-info-content': color === 'info',
      'text-primary-content': color === 'primary',
      'text-secondary-content': color === 'secondary',
      'text-success-content': color === 'success',
      'text-warning-content': color === 'warning',
      'ring ring-offset-base-100 ring-offset-2': border,
      'ring-accent': borderColor === 'accent',
      'ring-error': borderColor === 'error',
      'ring-ghost': borderColor === 'ghost',
      'ring-info': borderColor === 'info',
      'ring-primary': borderColor === 'primary',
      'ring-secondary': borderColor === 'secondary',
      'ring-success': borderColor === 'success',
      'ring-warning': borderColor === 'warning',
      'rounded-btn': shape === 'square',
      'rounded-full': shape === 'circle',
    })
    const [_width, setWidth] = useState(size)
    const [_height, setHeight] = useState(size)
    const customImgDimension = { width: size, height: size }
    const [imageLoadedState, setImageLoadedState] = useState<0 | 1 | 2>(0)
    useEffect(() => {
      setImageLoadedState(0)
    }, [src])
    const renderAvatarContents = (loadState: 0 | 1 | 2) => {
      // Base case, if src is provided, render img
      if (src) {
        return (
          <div className={`${imgClasses} ${imageClassName}`} style={customImgDimension}>
            {
              loadState == 0 && <Image quality={40} src={src} alt={''} width={_width} height={_height} className={`mask mask-circle blur`}
                onLoadingComplete={(e) => {
                  const containerMult = 1
                  const naturalMult = e.naturalWidth / e.naturalHeight


                  if (naturalMult > containerMult) {
                    const reqH = _height * 1.2
                    const reqW = reqH * naturalMult
                    setHeight(reqH)
                    setWidth(reqW)
                    setImageLoadedState(1)
                  }
                  else {
                    const reqW = _width * 1.2
                    const reqH = reqW / naturalMult
                    setWidth(reqW)
                    setHeight(reqH)
                    setImageLoadedState(1)
                  }
                }} />
            }
            {
              loadState == 1 && <Image quality={100} src={src} alt={''} width={_width} height={_height} className={`mask mask-circle blur`}
                onLoadingComplete={(e) => {
                  setImageLoadedState(2)
                }} />
            }
            {
              loadState == 2 && <Image quality={100} src={src} alt={''} width={_width} height={_height} className={`mask mask-circle`} />
            }
          </div>
        )
      }
      // Render a text avatar if letters are provided, or a single child that is a string
      else if (letters || isSingleStringChild(children)) {
        return (
          <div className={placeholderClasses} style={customImgDimension}>
            <span>{letters ? letters : children}</span>
          </div>
        )
      }
      // Render if a single, not string child was provided (allows for SVGs) and merges classes and styles
      else if (React.Children.count(children) === 1) {
        const firstChild = React.Children.only(children) as React.ReactElement
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        return React.cloneElement(firstChild, { className: twMerge(imgClasses, firstChild.props.className), style: { ...customImgDimension, ...firstChild.props.style }, })
      }
      // Render a wrapping div around all children if there is more than one child.
      else {
        return (
          <div className={imgClasses} style={customImgDimension}>
            {children}
          </div>
        )
      }
    }

    return (
      <div
        aria-label="Avatar photo"
        {...props}
        data-theme={dataTheme}
        className={containerClasses}
        ref={ref}
      >
        {/* <div className=' -left-10 -top-10 z-20'>{imageLoadedState}</div> */}
        {renderAvatarContents(imageLoadedState)}
      </div>
    )
  }
)

export default Object.assign(Avatar, {
  Group: AvatarGroup,
})