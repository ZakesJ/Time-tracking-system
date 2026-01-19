"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Command as CommandPrimitive } from "cmdk";


import { cn } from "@/lib/utils";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/common/command";
import { Input } from "@/components/common/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/common/popover";
import { Skeleton } from "@/components/common/skeleton";

type Props<T extends string> = {
  selectedValue: T;
  onSelectedValueChange: (value: T, metadata?: { client?: string; taskType?: string[] }) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  items: { value: T; label: string; client?: string; taskType?: string[] }[];
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  title?: string;
  id?: string;
};

export function AutoComplete<T extends string>({
  selectedValue,
  onSelectedValueChange,
  searchValue,
  onSearchValueChange,
  items,
  isLoading,
  placeholder = "Search...",
  className,
  disabled,
  title,
  id,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [wasManuallyClosed, setWasManuallyClosed] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(undefined);

  // Measure anchor width for popover
  useEffect(() => {
    if (anchorRef.current) {
      const updateWidth = () => {
        setPopoverWidth(anchorRef.current?.offsetWidth);
      };
      updateWidth();
      const resizeObserver = new ResizeObserver(updateWidth);
      resizeObserver.observe(anchorRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const labels = useMemo(
    () =>
      items.reduce((acc, item) => {
        acc[item.value] = item.label;
        return acc;
      }, {} as Record<string, string>),
    [items]
  );

  const reset = () => {
    onSelectedValueChange("" as T);
    onSearchValueChange("");
  };

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Don't reset if user is interacting with the popover
    if (
      e.relatedTarget?.hasAttribute("cmdk-list") ||
      e.relatedTarget?.closest('[data-slot="popover-content"]')
    ) {
      return;
    }

    const trimmedSearch = searchValue.trim();
    
    // If there's no search value, clear everything
    if (!trimmedSearch) {
      reset();
      return;
    }

    // Check if the typed value matches any item in the list exactly
    const exactMatch = items.find(item => item.value === trimmedSearch || item.label === trimmedSearch);
    
    if (exactMatch) {
      // If there's an exact match, select it (even if already selected, ensure it's committed)
      onSelectedValueChange(exactMatch.value as T, {
        client: exactMatch.client,
        taskType: exactMatch.taskType,
      });
      onSearchValueChange(exactMatch.label);
    } else {
      // If no match, preserve the typed text as the selected value (free text entry)
      // Always commit on blur to ensure the form value is set
      // Update search value first to trimmed version to ensure sync, then commit selection
      if (searchValue !== trimmedSearch) {
        onSearchValueChange(trimmedSearch);
      }
      onSelectedValueChange(trimmedSearch as T);
    }
  };

  const onSelectItem = (inputValue: string) => {
    if (inputValue === selectedValue) {
      reset();
      onSelectedValueChange("" as T);
    } else {
      const selectedItem = items.find(item => item.value === inputValue);
      onSelectedValueChange(inputValue as T, {
        client: selectedItem?.client,
        taskType: selectedItem?.taskType,
      });
      onSearchValueChange(labels[inputValue] ?? "");
    }
    setOpen(false);
    setWasManuallyClosed(false);
  };

  // Only show popover when there are results and user is typing
  const shouldShowPopover = useMemo(() => {
    return searchValue.trim().length > 0 && items.length > 0 && !isLoading;
  }, [searchValue, items.length, isLoading]);

  // Update open state based on whether we should show popover
  // Don't auto-open if user manually closed it
  useEffect(() => {
    if (shouldShowPopover && !wasManuallyClosed) {
      setOpen(true);
    } else if (!shouldShowPopover) {
      setOpen(false);
      setWasManuallyClosed(false);
    }
  }, [shouldShowPopover, wasManuallyClosed]);

  return (
    <div className={cn("flex items-center w-full", className)}>
      <Popover 
        open={open} 
        onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen) {
            setWasManuallyClosed(true);
          }
        }}
      >
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <div ref={anchorRef} className="w-full">
              <CommandPrimitive.Input
                asChild
                value={searchValue}
                onValueChange={(value) => {
                  onSearchValueChange(value);
                  // Popover will open/close based on shouldShowPopover logic
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setOpen(false);
                    setWasManuallyClosed(true);
                  }
                }}
                onBlur={onInputBlur}
                disabled={disabled}
              >
                <Input 
                  id={id}
                  placeholder={placeholder} 
                  disabled={disabled}
                  showLabel={false}
                  showHelperText={false}
                  className="w-full"
                />
              </CommandPrimitive.Input>
            </div>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                (e.target.hasAttribute("cmdk-input") ||
                 e.target.closest('[data-slot="command-input"]'))
              ) {
                e.preventDefault();
              }
            }}
            className="p-0"
            align="start"
            style={{ width: popoverWidth ? `${popoverWidth}px` : undefined }}
          >
            <CommandList>
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {items.length > 0 && !isLoading && (
                <CommandGroup>
                  {title && (
                    <div className="px-3 py-2.5 text-xs font-bold text-foreground uppercase border-b border-border">
                      {title}
                    </div>
                  )}
                  {items.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={onSelectItem}
                    >
                     
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
