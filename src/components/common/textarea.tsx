import * as React from "react"
import { CheckCircle2, InfoIcon, TriangleAlert, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "./label"

type TextareaState = "default" | "warning" | "error" | "success"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string
  helperText?: string
  optional?: boolean
  state?: TextareaState
  showLabel?: boolean
  showHelperText?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    label,
    helperText,
    optional = false,
    state = "default",
    showLabel = true,
    showHelperText = true,
    disabled,
    ...props
  }, ref) => {
    const textareaId = React.useId()
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

    const textareaElement = (
      <textarea
        ref={ref}
        id={textareaId}
        data-slot="textarea"
        disabled={disabled}
        aria-invalid={state === "error" || state === "warning" ? true : undefined}
        aria-describedby={helperText && showHelperText ? helperTextId : undefined}
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          disabled ? "border-muted-foreground" : stateStyles[state],
          className
        )}
        {...props}
      />
    )

    if (!hasLabelOrHelper) {
      return textareaElement
    }

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && showLabel && (
          <div className="flex items-center gap-2 w-full">
            <Label
              htmlFor={textareaId}
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

        {textareaElement}

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

Textarea.displayName = "Textarea"

export { Textarea }
export type { TextareaProps, TextareaState }
