import * as React from 'react';
import { isValidElement, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import {  ChevronDown, ChevronUp, CheckCircle2, InfoIcon, TriangleAlert, XCircle } from 'lucide-react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Label } from './label';

// Create a Context for `indicatorPosition` and `indicator` control
const SelectContext = React.createContext<{
  indicatorPosition: 'left' | 'right';
  indicatorVisibility: boolean;
  indicator: ReactNode;
}>({ indicatorPosition: 'right', indicator: null, indicatorVisibility: true });

type SelectState = "default" | "warning" | "error" | "success";

interface SelectProps extends React.ComponentProps<typeof SelectPrimitive.Root> {
  label?: string;
  helperText?: string;
  optional?: boolean;
  state?: SelectState;
  showLabel?: boolean;
  showHelperText?: boolean;
}

// Root Component
const Select = ({
  indicatorPosition = 'right',
  indicatorVisibility = true,
  indicator,
  label,
  helperText,
  optional = false,
  state = "default",
  showLabel = true,
  showHelperText = true,
  disabled,
  ...props
}: SelectProps & {
  indicatorPosition?: 'left' | 'right';
  indicatorVisibility?: boolean;
  indicator?: ReactNode;
}) => {
  const selectId = React.useId();
  const helperTextId = React.useId();

  const helperTextStyles = {
    default: "",
    warning: "text-warning",
    error: "text-destructive",
    success: "text-success",
  };

  const helperIcons = {
    default: InfoIcon,
    warning: TriangleAlert,
    error: XCircle,
    success: CheckCircle2,
  };

  const HelperIcon = helperIcons[disabled ? "default" : state];

  const hasLabelOrHelper = (label && showLabel) || (helperText && showHelperText);

  const selectElement = (
    <SelectPrimitive.Root {...props}>
      <SelectContext.Provider value={{ indicatorPosition, indicatorVisibility, indicator }}>
        {props.children}
      </SelectContext.Provider>
    </SelectPrimitive.Root>
  );

  if (!hasLabelOrHelper) {
    return selectElement;
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && showLabel && (
        <div className="flex items-center gap-2 w-full">
          <Label
            htmlFor={selectId}
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

      <SelectPrimitive.Root {...props}>
        <SelectContext.Provider value={{ indicatorPosition, indicatorVisibility, indicator }}>
          {React.Children.map(props.children, (child) =>
            React.isValidElement(child) && child.type === SelectTrigger
              ? React.cloneElement(child, {
                  selectId,
                  state,
                  disabled,
                  "aria-describedby": helperText && showHelperText ? helperTextId : undefined,
                } as React.ComponentProps<typeof SelectTrigger> & {
                  selectId: string;
                  state?: SelectState;
                  disabled?: boolean;
                  "aria-describedby"?: string;
                })
              : child
          )}
        </SelectContext.Provider>
      </SelectPrimitive.Root>

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
  );
};

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

// Define size variants for SelectTrigger
const selectTriggerVariants = cva(
  `
    flex bg-background w-full items-center justify-between outline-none border border-input shadow-xs shadow-black/5 transition-shadow 
    text-foreground data-placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] 
    focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
    [[data-invalid=true]_&]:border-destructive/60 [[data-invalid=true]_&]:ring-destructive/10  dark:[[data-invalid=true]_&]:border-destructive dark:[[data-invalid=true]_&]:ring-destructive/20
  `,
  {
    variants: {
      size: {
        sm: 'h-7 px-2.5  gap-1 rounded-md',
        md: 'h-8.5 px-3  leading-(--text-sm--line-height) gap-1 rounded-md',
        lg: 'h-10 px-4  gap-1.5 rounded-md',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface SelectTriggerProps
  extends React.ComponentProps<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  selectId?: string;
  state?: SelectState;
  disabled?: boolean;
}

function SelectTrigger({ className, children, size, selectId, state, disabled, ...props }: SelectTriggerProps) {
  const stateStyles = {
    default: "",
    warning: "border-warning focus-visible:border-warning",
    error: "border-destructive focus-visible:border-destructive",
    success: "border-success focus-visible:border-success",
  };

  return (
    <SelectPrimitive.Trigger
      id={selectId}
      data-slot="select-trigger"
      className={cn(
        selectTriggerVariants({ size }),
        disabled ? "border-muted-foreground" : stateStyles[state || "default"],
        className
      )}
      aria-invalid={state === "error" || state === "warning" ? true : undefined}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-100 text-current -me-0.5" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <ChevronUp className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover shadow-md shadow-black/5 text-secondary-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1.5 data-[side=left]:-translate-x-1.5 data-[side=right]:translate-x-1.5 data-[side=top]:-translate-y-1.5',
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1.5',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn('py-1.5 ps-8 pe-2 text-xs text-muted-foreground font-medium', className)}
      {...props}
    />
  );
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const { indicatorPosition, indicatorVisibility, indicator } = React.useContext(SelectContext);

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5  outline-hidden text-foreground hover:bg-accent focus:bg-accent data-disabled:pointer-events-none data-disabled:opacity-50",
        indicatorPosition === "left" ? "ps-8 pe-2" : "pe-8 ps-2",
        className
      )}
      {...props}
    >
      {indicatorVisibility &&
        (indicator && isValidElement(indicator) ? (
          indicator
        ) : (
          <span
            className={cn(
              "absolute flex h-3.5 w-3.5 items-center justify-center",
              indicatorPosition === "left" ? "start-2" : "end-2"
            )}
          >
            <SelectPrimitive.ItemIndicator>
              <CheckCircle2 className="h-4 w-4 text-secondary" />
            </SelectPrimitive.ItemIndicator>
          </span>
        ))}
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectIndicator({
  children,
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ItemIndicator>) {
  const { indicatorPosition } = React.useContext(SelectContext);

  return (
    <span
      data-slot="select-indicator"
      className={cn(
        'absolute flex top-1/2 -translate-y-1/2 items-center justify-center',
        indicatorPosition === 'left' ? 'start-2' : 'end-2',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemIndicator>{children}</SelectPrimitive.ItemIndicator>
    </span>
  );
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('-mx-1.5 my-1.5 h-px bg-border', className)}
      {...props}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectIndicator,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};

export type { SelectProps, SelectState };
