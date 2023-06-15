import React from 'react'
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

export type AvatarProps = React.HTMLAttributes<HTMLDivElement> &
  IComponentBaseProps & {
    width: number
    height: number
    src?: string | null
    letters?: string
    size?: ComponentSize | number
    shape?: ComponentShape
    color?: ComponentColor
    border?: boolean
    borderColor?: ComponentColor
    online?: boolean
    offline?: boolean
    children?: React.ReactNode
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
    size = 'md',
    width,
    height,
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
      'w-32 h-32': size === 'lg',
      'w-24 h-24': size === 'md',
      'w-14 h-14': size === 'sm',
      'w-10 h-10': size === 'xs',
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
      'w-32 h-32 text-3xl': size === 'lg',
      'w-24 h-24 text-xl': size === 'md',
      'w-14 h-14': size === 'sm',
      'w-10 h-10': size === 'xs',
    })

    const customImgDimension = { width, height }

    const renderAvatarContents = () => {
      // Base case, if src is provided, render img
      if (src) {
        return (
          <div className={imgClasses} style={customImgDimension}>
            <Image src={src} alt={''} width={width} height={height} />
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
        {renderAvatarContents()}
      </div>
    )
  }
)

export default Object.assign(Avatar, {
  Group: AvatarGroup,
})