import React, { ReactNode } from "react"
import { _get } from "@bug_sam/common"

const __TAILWIND_CSS = {
    root: "cursor-pointer font-inter font-medium text-sm rounded-lg border-solid border focus:ring-2 focus:z-10 inline-flex items-center", //me-2 mb-2 
    primary: "text-white border-primary/50 bg-primary hover:bg-primary/85 focus:ring-accent",
    secondary:"text-primary border-secondary bg-secondary hover:bg-secondary/85 focus:ring-secondary/30",
    accent: "text-white border-accent bg-accent hover:bg-accent/50 focus:ring-accent/30 focus:outline-none",
    white: "border-white text-primary focus:outline-none bg-white hover:bg-gray-100 hover:border-gray-100 hover:text-blue-700 focus:ring-text-blue-700",
    default: "text-white border-blue-500 bg-blue-500 hover:bg-blue-700 focus:ring-blue-700",

    //states
    disabled: "disabled:bg-slate-50 disabled:text-slate-500 disabled:border",
    
    // Sizes
    sm: 'px-1 py-1',
    md: 'px-4 py-2',
    lg: 'px-5 py-2.5 text-2xl',
}

type ButtonVariants = 'default' | 'primary' | 'secondary' | 'white' | 'accent' 
type ButtonSizes = 'sm' | 'md' | 'lg'
interface Button {
    variant?: ButtonVariants 
    size?: ButtonSizes
    children: ReactNode | string
    disabled?:boolean
    onClick?: (event: | React.MouseEvent<HTMLButtonElement>) => void | null
}


export const Button = ({ variant='default', size='md', children, onClick, disabled=false }: Button) => {
    const classes = `${__TAILWIND_CSS.root} ${__TAILWIND_CSS[variant]} ${__TAILWIND_CSS[size]} ${__TAILWIND_CSS.disabled}`

    return <button disabled={disabled}
        className={classes}
        onClick={onClick}> 
        {children} 
    </button>
}
