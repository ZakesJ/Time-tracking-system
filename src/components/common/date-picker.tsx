import * as React from "react"
import { Info, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/common/button"
import { Calendar } from "@/components/common/calendar"
import { Input } from "@/components/common/input"
import { Label } from "@/components/common/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/popover"
import { cn } from "@/lib/utils"
import type { DateRange, DatePickerProps } from "@/lib/types"
import InlineSVG from "../inline-svg/inline-svg-component"

// ============================================================================
// Helper Component
// ============================================================================

const HelperText = ({ text, disabled, state }: { text?: string; disabled: boolean; state?: "default" | "warning" | "error" | "success" }) => {
  const helperIcons = {
    default: Info,
    warning: AlertTriangle,
    error: XCircle,
    success: CheckCircle2,
    disabled: Info,
  }

  const helperStyles = {
    default: "",
    warning: "text-warning",
    error: "text-destructive",
    success: "text-success",
    disabled: "text-muted-foreground",
  }

  const currentState = disabled ? "disabled" : (state || "default")
  const HelperIcon = helperIcons[currentState]

  return (
    <div className="flex items-center gap-2 text-xs">
      <HelperIcon className="h-3 w-3 shrink-0" />
      <span className={disabled ? helperStyles.disabled : helperStyles[state || "default"]}>
        {text || "This is helper text"}
      </span>
    </div>
  )
}

// ============================================================================
// Component
// ============================================================================

export function DatePicker({
  value,
  onChange,
  rangeValue,
  onRangeChange,
  displayValue = "",
  onInputChange,
  label = "Date",
  placeholder = "Select date",
  disabled = false,
  className,
  width = "w-full",
  id,
  required = false,
  optional = false,
  mode = "single",
  variant = "button",
  numberOfMonths = 2,
  helperText,
  state = "default",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Handle input key down
  const handleInputKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setOpen(true)
    }
  }, [])

  // Handle calendar selection
  const handleDateSelect = React.useCallback((selectedDate: Date | undefined) => {
    onChange?.(selectedDate)
    setOpen(false)
  }, [onChange])

  const handleRangeSelect = React.useCallback((selectedRange: DateRange | undefined) => {
    onRangeChange?.(selectedRange)
    if (selectedRange?.from && selectedRange?.to) {
      setOpen(false)
    }
  }, [onRangeChange])

  // State-based border and focus styles
  const getStateStyles = () => {
    if (disabled) return "border-muted-foreground"

    const stateStyles = {
      default: "border-input focus-visible:border-ring",
      warning: "border-warning aria-invalid:border-warning focus-visible:border-warning",
      error: "border-destructive aria-invalid:border-destructive focus-visible:border-destructive",
      success: "border-success focus-visible:border-success",
    }

    return stateStyles[state || "default"]
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label
          htmlFor={id}
          className={`px-1 flex items-center gap-2 justify-between w-full ${disabled ? "text-muted-foreground" : ""}`}
        >
          {label}
          {required ? <span className="text-destructive ml-1">*</span> : optional ? <span className=" ml-1 text-navy-200 text-xs">Optional</span> : null}
        </Label>
      )}

      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            {variant === "input" ? (
              <div
                className={`relative bg-background h-12 rounded-lg border ${getStateStyles()} ${width}`}
              >
                <Input
                  id={id}
                  value={displayValue}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={`bg-transparent border-0 h-full px-4 pr-12 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 ${
                    disabled ? "text-muted-foreground" : ""
                  } ${className || ""}`}
                  onChange={(e) => onInputChange?.(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`absolute px-2 right-2 top-1/2 -translate-y-1/2 h-4 w-4 ${
                    disabled ? "opacity-50" : ""
                  }`}
                  disabled={disabled}
                  onClick={() => setOpen(!open)}
                >
                  <InlineSVG src="/icons/outlined/calendar-icon.svg" height={16} width={16} ariaHidden className={cn(disabled ? "text-muted-foreground" : "text-current")} />
                  <span className="sr-only">Open calendar</span>
                </Button>
              </div>
            ) : (
              <Button
                id={id}
                variant="outline"
                disabled={disabled}
                className={cn(
                  "justify-between px-2 font-normal hover:bg-transparent",
                  width,
                  !displayValue && "text-muted-foreground",
                  className
                )}
              >
                {displayValue || placeholder}
               
                <InlineSVG src="/icons/outlined/calendar-icon.svg" height={16} width={16} ariaHidden className="" />
              </Button>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            {mode === "range" ? (
              <Calendar
                mode="range"
                selected={rangeValue}
                defaultMonth={rangeValue?.from}
                numberOfMonths={numberOfMonths}
                onSelect={handleRangeSelect}
                disabled={disabled}
                className="rounded-lg border-0 shadow-none"
              />
            ) : (
              <Calendar
                mode="single"
                selected={value}
                captionLayout="dropdown"
                defaultMonth={value}
                onSelect={handleDateSelect}
                disabled={disabled}
                className="rounded-lg border-0 shadow-none"
              />
            )}
          </PopoverContent>
        </Popover>
      </div>

      {helperText && <HelperText text={helperText} disabled={disabled} state={state} />}
    </div>
  );
}
