'use client';

import { forwardRef, useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';
import { useForwardedRef } from '@/hooks/use-forward-ref';
import { type VariantProps } from 'class-variance-authority';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import { Input } from './input';
import { Button, buttonVariants } from './button';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

type ButtonProps = React.ComponentProps<typeof Button> & VariantProps<typeof buttonVariants>;

const ColorPicker = forwardRef<
  HTMLInputElement,
  Omit<ButtonProps, 'value' | 'onChange' | 'onBlur'> & ColorPickerProps
>(
  (
    { disabled, value, onChange, onBlur, name, className, size, ...props },
    forwardedRef
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const [open, setOpen] = useState(false);

    const parsedValue = useMemo(() => {
      // Always prefer the provided value if it's a valid hex color
      if (value && typeof value === 'string') {
        // Check for valid 6-digit hex
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
          return value;
        }
        // Check for 3-digit hex and expand it
        if (/^#[0-9A-Fa-f]{3}$/.test(value)) {
          const hex = value.slice(1);
          return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
        }
        // If it starts with # but is incomplete, pad it (react-colorful can handle partial hex)
        if (value.startsWith('#') && /^#[0-9A-Fa-f]{0,6}$/.test(value)) {
          return value;
        }
      }
      // Only default to white if no valid value is provided
      // This ensures the color picker always shows the current theme color when available
      return '#FFFFFF';
    }, [value]);

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            {...props}
            className={cn('block', className)}
            name={name}
            size={size}
            style={{
              backgroundColor: parsedValue,
            }}
            variant='outline'
            onBlur={onBlur}
          >
            <div />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full'>
          <HexColorPicker 
            color={parsedValue || '#FFFFFF'} 
            onChange={onChange} 
          />
          <Input
          className='border-0'
            maxLength={7}
            onChange={(e) => {
              const newValue = e?.currentTarget?.value || '';
              if (newValue === '' || /^#[0-9A-Fa-f]{0,6}$/.test(newValue)) {
                onChange(newValue);
              }
            }}
            ref={ref}
            value={parsedValue}
            placeholder='#FFFFFF'
          />
        </PopoverContent>
      </Popover>
    );
  }
);
ColorPicker.displayName = 'ColorPicker';

export { ColorPicker };