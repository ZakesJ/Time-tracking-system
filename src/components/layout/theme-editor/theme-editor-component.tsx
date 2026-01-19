"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useThemeContext } from "@/providers/theme-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/common/accordion";
import { Palette, RotateCcw } from "lucide-react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { ColorPicker } from "@/components/common/color-picker";
import type { SemanticColorPair, ColorValue } from "@/lib/theme/theme-types";
import { normalizeColorToString, normalizeColorForInput, readCssVariableFromStylesheet } from "@/lib/theme/color-utils";
import { parse, formatHex } from "culori";

interface ColorEditorProps {
  label: string;
  colorPair: SemanticColorPair;
  onColorChange: (color: string) => void;
  onForegroundChange: (color: string) => void;
  colorVar: string;
}

function ColorEditor({
  label,
  colorPair,
  onColorChange,
  onForegroundChange,
  colorVar,
}: ColorEditorProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const colorValue = normalizeColorToString(colorPair.color);
  const foregroundValue = normalizeColorToString(colorPair.foreground);
  
  // Helper function to get computed hex color from CSS variable using culori
  // Resolves CSS variables and converts oklch/other formats to hex
  const getComputedHexColor = useCallback((cssVar: string): string => {
    if (typeof window === "undefined" || !mounted) return "#000000";
    
    try {
      let colorValue = cssVar;
      
      // If it's a CSS variable, resolve it recursively
      if (cssVar.startsWith("var(")) {
        const varMatch = cssVar.match(/var\((--[^)]+)\)/);
        if (varMatch) {
          // Read from stylesheet to preserve oklch format (not LAB)
          const resolved = readCssVariableFromStylesheet(varMatch[1]);
          if (resolved && resolved.trim() !== "") {
            colorValue = resolved.trim();
            // If resolved value is still a CSS variable, resolve recursively
            if (colorValue.startsWith("var(")) {
              return getComputedHexColor(colorValue);
            }
          } else {
            // Fallback: use browser's computed style (may return LAB format)
            const root = document.documentElement;
            const computed = getComputedStyle(root).getPropertyValue(varMatch[1]).trim();
            if (computed && computed !== "") {
              colorValue = computed;
            }
          }
        }
      }
      
      // Parse the color using culori (handles oklch, rgb, hsl, hex, etc.)
      const parsed = parse(colorValue);
      
      if (parsed) {
        // Format as hex using culori
        const hex = formatHex(parsed);
        // Ensure we return a valid 6-digit hex (culori may include alpha)
        if (hex && hex.startsWith("#")) {
          // Remove alpha channel if present (#rrggbbaa -> #rrggbb)
          return hex.length === 9 ? hex.slice(0, 7) : hex.length === 7 ? hex : "#000000";
        }
      }
      
      // Fallback to normalizeColorForInput if culori parsing fails
      return normalizeColorForInput(cssVar) || "#000000";
    } catch (error) {
      console.warn("Failed to get computed hex color with culori:", error);
      // Fallback to normalizeColorForInput
      return normalizeColorForInput(cssVar) || "#000000";
    }
  }, [mounted]);
  
  // Helper to convert ColorValue to string for CSS
  const colorToString = useCallback((color: string | ColorValue): string => {
    if (typeof color === "string") {
      return color;
    }
    // ColorValue object - prefer hex, then oklch, then other formats
    return color.hex || color.oklch || color.rgb || color.hsl || "";
  }, []);
  
  // Ensure hex values are always valid - compute after mount to ensure CSS variables are available
  const colorHex = useMemo(() => {
    if (!mounted) return "#000000";
    const colorStr = colorToString(colorPair.color);
    const hex = getComputedHexColor(colorStr);
    // Ensure we always return a valid hex (never empty string)
    return hex && hex.startsWith("#") && hex.length === 7 ? hex : "#000000";
  }, [colorPair.color, mounted, getComputedHexColor, colorToString]);
  
  const foregroundHex = useMemo(() => {
    if (!mounted) return "#000000";
    const colorStr = colorToString(colorPair.foreground);
    const hex = getComputedHexColor(colorStr);
    // Ensure we always return a valid hex (never empty string)
    return hex && hex.startsWith("#") && hex.length === 7 ? hex : "#000000";
  }, [colorPair.foreground, mounted, getComputedHexColor, colorToString]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Label className="text-sm font-medium min-w-[140px]">{label}</Label>
        <div
          className="w-8 h-8 rounded border border-border shadow-sm flex-shrink-0"
          style={{ backgroundColor: `var(${colorVar})` }}
        />
        <div className="flex-1 flex items-center gap-2">
          <Input
            type="text"
            value={colorValue}
            onChange={(e) => onColorChange(e.target.value)}
            placeholder="oklch(...)"
            className="flex-1 text-xs uppercase  h-8"
          />
          <ColorPicker
            value={colorHex}
            onChange={(hex) => onColorChange(hex)}
            size="sm"
            className="w-8 h-8 p-0 flex-shrink-0 [&>div]:w-full [&>div]:h-full"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Label className="text-sm font-medium min-w-[140px]">{label} Foreground</Label>
        <div
          className="w-8 h-8 rounded border border-border shadow-sm flex-shrink-0"
          style={{ backgroundColor: `var(${colorVar}-foreground)` }}
        />
        <div className="flex-1 flex items-center gap-2">
          <Input
            type="text"
            value={foregroundValue}
            onChange={(e) => onForegroundChange(e.target.value)}
            placeholder="oklch(...)"
            className="flex-1 text-xs uppercase  h-8"
          />
          <ColorPicker
            value={foregroundHex}
            onChange={(hex) => onForegroundChange(hex)}
            size="sm"
            className="w-8 h-8 p-0 flex-shrink-0 [&>div]:w-full [&>div]:h-full"
          />
        </div>
      </div>
    </div>
  );
}


interface ThemeEditorProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ThemeEditor({ open: controlledOpen, onOpenChange: controlledOnOpenChange }: ThemeEditorProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { theme, updateTheme, resetToDefault } = useThemeContext();

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  
  // Create a unified setOpen function that works for both controlled and uncontrolled modes
  const setOpen = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    if (controlledOnOpenChange) {
      // Controlled mode: onOpenChange expects a boolean
      if (typeof value === 'function') {
        const newValue = value(open);
        controlledOnOpenChange(newValue);
      } else {
        controlledOnOpenChange(value);
      }
    } else {
      // Uncontrolled mode: setInternalOpen accepts boolean or function
      setInternalOpen(value);
    }
  }, [controlledOnOpenChange, open]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const handleColorChange = useCallback(
    (path: string[], value: string) => {
      const newTheme = JSON.parse(JSON.stringify(theme)); // Deep clone
        
      let current: Record<string, unknown> = newTheme;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]] as Record<string, unknown>;
      }
        
      current[path[path.length - 1]] = value;
      updateTheme(newTheme);
    },
    [theme, updateTheme]
  );

  const handleReset = useCallback(() => {
    resetToDefault();
  }, [resetToDefault]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl max-h-[calc(100vh-2rem)] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 pr-20 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-current" />
              <DialogTitle className="text-xl font-semibold">Theme Editor</DialogTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-8 no-scrollbar">
          <Accordion type="multiple" defaultValue={["primary", "secondary", "tertiary", "accent"]} className="space-y-2">
            {/* Primary Colors */}
            <AccordionItem value="primary" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium">Primary Colors</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2 pb-4">
                <ColorEditor
                  label="Primary"
                  colorPair={theme.colors.primary}
                  onColorChange={(color) =>
                    handleColorChange(["colors", "primary", "color"], color)
                  }
                  onForegroundChange={(color) =>
                    handleColorChange(["colors", "primary", "foreground"], color)
                  }
                  colorVar="--primary"
                />
              </AccordionContent>
            </AccordionItem>

            {/* Secondary Colors */}
            <AccordionItem value="secondary" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium">Secondary Colors</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2 pb-4">
                <ColorEditor
                  label="Secondary"
                  colorPair={theme.colors.secondary}
                  onColorChange={(color) =>
                    handleColorChange(["colors", "secondary", "color"], color)
                  }
                  onForegroundChange={(color) =>
                    handleColorChange(["colors", "secondary", "foreground"], color)
                  }
                  colorVar="--secondary"
                />
              </AccordionContent>
            </AccordionItem>

            {/* Tertiary Colors */}
            {theme.colors.tertiary && (
              <AccordionItem value="tertiary" className="border !border-b rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium">Tertiary Colors</AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2 pb-4">
                  <ColorEditor
                    label="Tertiary"
                    colorPair={theme.colors.tertiary}
                    onColorChange={(color) =>
                      handleColorChange(["colors", "tertiary", "color"], color)
                    }
                    onForegroundChange={(color) =>
                      handleColorChange(["colors", "tertiary", "foreground"], color)
                    }
                    colorVar="--tertiary"
                  />
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Accent Colors */}
            {/* <AccordionItem value="accent" className="border !border-b rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium">Accent Colors</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2 pb-4">
                <ColorEditor
                  label="Accent"
                  colorPair={theme.colors.accent}
                  onColorChange={(color) =>
                    handleColorChange(["colors", "accent", "color"], color)
                  }
                  onForegroundChange={(color) =>
                    handleColorChange(["colors", "accent", "foreground"], color)
                  }
                  colorVar="--accent"
                />
              </AccordionContent>
            </AccordionItem> */}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}
