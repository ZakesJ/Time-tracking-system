export type ColorFamily = 'navy' | 'blue' | 'cyan' | 'green' | 'info' | 'yellow' | 'red' | 'gray'

export interface ImprovementInsight {
  id: string;
  type: 'risks-opportunities' | 'knowledge-skill-transfer' | 'improvements-value-add' | 'learning';
  content: string;
}

export interface Task {
    id: string
    title: string
    description?: string
    client: string
    taskType: string[]
    startTime: string
    endTime: string
    day: number
    month: number
    year: number
    repeat: boolean
    occurrence?: string
    customDays?: string[]
    startDate?: Date | string
    endDate?: Date | string
    kpiEntry: boolean
    color: ColorFamily
    improvementInsights?: ImprovementInsight[]
  }
  

  export interface DateRange {
    from: Date | undefined
    to?: Date | undefined
  }
  
  export interface DatePickerProps {
    /** The currently selected date */
    value?: Date
    /** Callback fired when the date changes (from calendar) */
    onChange?: (date: Date | undefined) => void
    /** The currently selected date range (for range mode) */
    rangeValue?: DateRange | undefined
    /** Callback fired when the date range changes (from calendar) */
    onRangeChange?: (range: DateRange | undefined) => void
    /** Display value for button/input (parent formats this) */
    displayValue?: string
    /** Callback fired when input value changes (for input variant typing) */
    onInputChange?: (value: string) => void
    /** Label text for the date picker */
    label?: string
    /** Placeholder text when no date is selected */
    placeholder?: string
    /** Whether the date picker is disabled */
    disabled?: boolean
    /** Custom className for the trigger button */
    className?: string
    /** Width of the trigger button */
    width?: string
    /** ID for the date picker input */
    id?: string
    /** Whether the label is required */
    required?: boolean
    /** Whether the label is optional */
    optional?: boolean
    /** Mode of the date picker - 'single' (default) or 'range' */
    mode?: "single" | "range"
    /** Variant of the trigger - 'button' (default) or 'input' */
    variant?: "button" | "input"
    /** Number of months to display (for range mode) */
    numberOfMonths?: number
    /** Helper text to display below the input */
    helperText?: string
    /** State of the date picker for styling (input variant only) */
    state?: "default" | "warning" | "error" | "success"
  }