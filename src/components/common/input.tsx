import * as React from "react"
import {  CheckCircle2, InfoIcon, TriangleAlert, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "./label"

type InputState = "default" | "warning" | "error" | "success"

interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  helperText?: string
  optional?: boolean
  state?: InputState
  showLabel?: boolean
  showHelperText?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label, 
    helperText, 
    optional = false,
    state = "default",
    showLabel = true,
    showHelperText = true,
    disabled,
    ...props 
  }, ref) => {
    const inputId = React.useId()
    const helperTextId = React.useId()

    const stateStyles = {
      default: "border-navy-200 focus-visible:border-ring",
      warning: "border-warning aria-invalid:border-warning focus-visible:border-warning",
      error: "border-destructive aria-invalid:border-destructive focus-visible:border-destructive",
      success: "border-success focus-visible:border-success",
    }

    const helperTextStyles = {
      default: "",
      warning: "text-warning",
      error: "text-destructive",
      success: "text-success",
    }

    const helperIcons = {
      default: InfoIcon,
      warning: TriangleAlert,
      error: XCircle,
      success: CheckCircle2,
    }

    const HelperIcon = helperIcons[disabled ? "default" : state]

    const hasLabelOrHelper = (label && showLabel) || (helperText && showHelperText)

    const inputElement = (
      <input
        ref={ref}
        id={inputId}
        type={type}
        data-slot="input"
        disabled={disabled}
        aria-invalid={state === "error" || state === "warning" ? true : undefined}
        aria-describedby={helperText && showHelperText ? helperTextId : undefined}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-12 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          disabled ? "border-muted-foreground" : stateStyles[state],
          className
        )}
        {...props}
      />
    )

    if (!hasLabelOrHelper) {
      return inputElement
    }

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && showLabel && (
          <div className="flex items-center gap-2 w-full">
            <Label 
              htmlFor={inputId}
              className={cn(
                "text-base font-medium",
                disabled && "text-muted-foreground"
              )}
            >
              {label}
            </Label>
            {optional && (
              <span className={cn(
                "text-xs text-navy-200 ml-auto",
                disabled && "text-muted-foreground"
              )}>
                Optional
              </span>
            )}
          </div>
        )}
        
        {inputElement}

        {helperText && showHelperText && (
          <div 
            id={helperTextId}
            className={cn(
              "flex items-center gap-2 text-xs",
              disabled ? "text-muted-foreground" : helperTextStyles[state]
            )}
          >
            <HelperIcon className="h-3 w-3 shrink-0" />
            <span className="leading-[1.2]">{helperText}</span>
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
export type { InputProps, InputState }
