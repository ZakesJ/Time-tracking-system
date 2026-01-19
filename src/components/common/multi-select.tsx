"use client";

import * as React from "react";
import { X, ChevronDown, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { Checkbox } from "@/components/common/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/common/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/popover";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  placeholder?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
  showCheckboxes?: boolean;
  maxDisplayItems?: number; // Prop for display limit
  disabled?: boolean;
  id?: string;
}

export function MultiSelect({
  options,
  placeholder = "Select options...",
  value: controlledValue,
  onChange,
  className,
  showCheckboxes = true,
  maxDisplayItems = 2, // Default to showing 2 items before collapsing
  disabled = false,
  id,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    controlledValue || []
  );
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setSelectedValues(controlledValue);
    }
  }, [controlledValue]);

  const handleSelect = (optionValue: string) => {
    const newSelectedValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    setSelectedValues(newSelectedValues);
    onChange?.(newSelectedValues);
  };

  const handleClearAll = () => {
    setSelectedValues([]);
    onChange?.([]);
  };

  const selectedItems = selectedValues
    .map((val) => options.find((option) => option.value === val))
    .filter(Boolean) as Option[];

  const displayItems = showAll ? selectedItems : selectedItems.slice(0, maxDisplayItems);
  const overflowCount = selectedItems.length - maxDisplayItems;

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between h-auto px-2 min-h-12 hover:bg-background flex-wrap",
            className
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selectedItems.length === 0 ? (
              <span className="text-muted-foreground font-normal">{placeholder}</span>
            ) : (
              <>
                {displayItems.map((item) => (
                  <Badge
                    key={item.value}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {item.label}
                    {!disabled && (
                      <X
                        className="h-3 w-3 cursor-pointer text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(item.value);
                        }}
                      />
                    )}
                  </Badge>
                ))}
                {overflowCount > 0 && !disabled && (
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-secondary/80 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAll(!showAll);
                    }}
                  >
                    {showAll ? `-${overflowCount} less` : `+${overflowCount} more`}
                  </Badge>
                )}
              </>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0 z-[100]" sideOffset={4}>
        <Command shouldFilter={true}>
          <CommandInput placeholder="Search..." />
          <CommandList className="max-h-[200px] overflow-y-auto overscroll-contain">
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer p-3  border-b border-border last:border-b-0 flex justify-between items-center gap-2 hover:bg-background"
                >
                  <span className="flex items-center gap-2">
                    {showCheckboxes && (
                      <Checkbox
                        checked={selectedValues.includes(option.value)}
                        onCheckedChange={() => handleSelect(option.value)}
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    {option.label}
                  </span>
                  {!showCheckboxes && selectedValues.includes(option.value) && (
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClearAll}
                    className="justify-center text-center cursor-pointer"
                  >
                    Clear all
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
