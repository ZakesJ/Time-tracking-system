/**
 * Color conversion utilities
 * Converts between different color formats including oklch
 */

/**
 * Resolves CSS variable references to their computed values
 * e.g., var(--primary) -> actual color value
 * Note: This may return LAB format from getComputedStyle
 */
export function resolveCssVariable(varName: string): string {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "";
  }
  
  const root = document.documentElement;
  const computedValue = getComputedStyle(root).getPropertyValue(varName.trim());
  return computedValue.trim() || "";
}

/**
 * Reads CSS variable value directly from stylesheet (preserves original format)
 * This avoids the LAB conversion that happens with getComputedStyle
 * Recursively resolves CSS variable chains
 */
export function readCssVariableFromStylesheet(varName: string, visited = new Set<string>()): string {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "";
  }
  
  // Prevent infinite loops
  if (visited.has(varName)) {
    return "";
  }
  visited.add(varName);
  
  const root = document.documentElement;
  const trimmedVarName = varName.trim();
  
  // Try to read from inline styles first
  const inlineValue = root.style.getPropertyValue(trimmedVarName);
  if (inlineValue) {
    const trimmed = inlineValue.trim();
    // If it's another CSS variable, resolve it
    const varMatch = trimmed.match(/var\((--[^)]+)\)/);
    if (varMatch) {
      return readCssVariableFromStylesheet(varMatch[1], visited);
    }
    return trimmed;
  }
  
  // Read from stylesheet
  for (let i = 0; i < document.styleSheets.length; i++) {
    try {
      const sheet = document.styleSheets[i];
      if (!sheet.cssRules) continue;
      
      for (let j = 0; j < sheet.cssRules.length; j++) {
        const rule = sheet.cssRules[j];
        if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
          const value = rule.style.getPropertyValue(trimmedVarName);
          if (value) {
            const trimmed = value.trim();
            // If it's another CSS variable, recursively resolve it
            const varMatch = trimmed.match(/var\((--[^)]+)\)/);
            if (varMatch) {
              return readCssVariableFromStylesheet(varMatch[1], visited);
            }
            return trimmed;
          }
        }
      }
    } catch {
      // Cross-origin stylesheets will throw, skip them
      continue;
    }
  }
  
  return "";
}

/**
 * Resolves a color value, handling CSS variables
 * For text display, we try to preserve oklch format by reading from stylesheet
 */
export function resolveColorValue(color: string, preserveFormat = false): string {
  if (!color) return "";
  
  // If it's a CSS variable, resolve it
  const varMatch = color.match(/var\((--[^)]+)\)/);
  if (varMatch) {
    const varName = varMatch[1];
    let resolved: string;
    
    if (preserveFormat) {
      // Try to read from stylesheet to preserve format
      resolved = readCssVariableFromStylesheet(varName);
      // If still a CSS variable, recursively resolve
      if (resolved && resolved.startsWith("var(")) {
        return resolveColorValue(resolved, preserveFormat);
      }
      // If empty, fall back to computed style
      if (!resolved) {
        resolved = resolveCssVariable(varName);
      }
    } else {
      resolved = resolveCssVariable(varName);
    }
    
    // If the resolved value is also a CSS variable, recursively resolve it
    if (resolved && resolved.startsWith("var(")) {
      return resolveColorValue(resolved, preserveFormat);
    }
    return resolved || color;
  }
  
  return color;
}

/**
 * Convert hex to oklch (simplified - for full conversion you'd need a color library)
 * This is a placeholder - in production you'd want to use a proper color conversion library
 */
export function hexToOklch(hex: string): string {
  // For now, return a placeholder
  // In production, use a library like culori or colorjs.io
  return hex;
}

/**
 * Convert oklch to hex (simplified)
 */
export function oklchToHex(oklch: string): string {
  // Parse oklch string: oklch(L C H)
  const match = oklch.match(/oklch\(([^)]+)\)/);
  if (!match) return "#000000";

  const values = match[1].split(/\s+/).map(parseFloat);
  if (values.length < 3) return "#000000";

  // Simplified conversion - in production use a proper library
  // For now, return a placeholder
  return "#000000";
}

/**
 * Convert any CSS color format to hex using browser's color parsing
 * This handles LAB, OKLCH, RGB, HSL, CSS variables, etc.
 * Always returns a 6-digit hex (#rrggbb) for HTML color inputs
 */
function cssColorToHex(cssColor: string): string {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "#000000";
  }
  
  if (!document.body || !cssColor || cssColor.trim() === "") {
    return "#000000";
  }
  
  // If it's already a hex color, validate and normalize it
  if (cssColor.startsWith("#")) {
    // Remove alpha channel if present (8 digits -> 6 digits)
    const hexMatch = cssColor.match(/^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/);
    if (hexMatch) {
      // Return only the 6-digit hex (ignore alpha)
      return `#${hexMatch[1]}`;
    }
    // If it's a 3-digit hex, expand it
    const shortHexMatch = cssColor.match(/^#([0-9a-fA-F]{3})$/);
    if (shortHexMatch) {
      const hex = shortHexMatch[1];
      return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }
    // Invalid hex format
    return "#000000";
  }
  
  try {
    // Create a temporary element to use browser's color parsing
    const tempEl = document.createElement("div");
    tempEl.style.position = "absolute";
    tempEl.style.visibility = "hidden";
    tempEl.style.width = "1px";
    tempEl.style.height = "1px";
    tempEl.style.top = "-9999px";
    tempEl.style.left = "-9999px";
    
    // Set the color (this works for CSS variables, oklch, lab, rgb, etc.)
    tempEl.style.color = cssColor;
    document.body.appendChild(tempEl);
    
    // Force a reflow to ensure styles are applied
    void tempEl.offsetHeight;
    
    // Get computed color as RGB
    const computedColor = window.getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);
    
    // Check if we got a valid color
    if (!computedColor || computedColor === "rgba(0, 0, 0, 0)" || computedColor === "transparent") {
      // If the computed color is transparent or invalid, try backgroundColor instead
      // This helps with CSS variables that might not work with color property
      const tempEl2 = document.createElement("div");
      tempEl2.style.position = "absolute";
      tempEl2.style.visibility = "hidden";
      tempEl2.style.width = "1px";
      tempEl2.style.height = "1px";
      tempEl2.style.top = "-9999px";
      tempEl2.style.left = "-9999px";
      tempEl2.style.backgroundColor = cssColor;
      document.body.appendChild(tempEl2);
      void tempEl2.offsetHeight;
      const bgColor = window.getComputedStyle(tempEl2).backgroundColor;
      document.body.removeChild(tempEl2);
      
      if (bgColor && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
        const rgbMatch = bgColor.match(/\d+/g);
        if (rgbMatch && rgbMatch.length >= 3) {
          const r = parseInt(rgbMatch[0], 10);
          const g = parseInt(rgbMatch[1], 10);
          const b = parseInt(rgbMatch[2], 10);
          
          const toHex = (n: number) => {
            const hex = Math.max(0, Math.min(255, n)).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
          };
          
          return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        }
      }
      
      return "#000000";
    }
    
    // Parse RGB: rgb(r, g, b) or rgba(r, g, b, a)
    const rgbMatch = computedColor.match(/\d+/g);
    if (rgbMatch && rgbMatch.length >= 3) {
      const r = parseInt(rgbMatch[0], 10);
      const g = parseInt(rgbMatch[1], 10);
      const b = parseInt(rgbMatch[2], 10);
      
      // Convert to hex (always 6 digits, no alpha)
      const toHex = (n: number) => {
        const hex = Math.max(0, Math.min(255, n)).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };
      
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
  } catch (error) {
    console.warn("Failed to convert CSS color to hex:", cssColor, error);
  }
  
  return "#000000";
}

/**
 * Normalize color value for display (for color input)
 * Resolves CSS variables and converts to hex when possible
 * Always returns a valid 6-digit hex color (#rrggbb)
 */
export function normalizeColorForInput(
  color: string | { oklch?: string; hex?: string }
): string {
  // Handle null/undefined
  if (!color) return "#000000";
  
  let colorValue: string;
  
  if (typeof color === "string") {
    colorValue = resolveColorValue(color);
  } else {
    colorValue = color.hex || color.oklch || "";
  }
  
  // Ensure we have a non-empty string
  if (!colorValue || typeof colorValue !== "string" || colorValue.trim() === "") {
    return "#000000";
  }
  
  colorValue = colorValue.trim();
  
  // If it's still a CSS variable (unresolved), try to resolve it using getComputedStyle
  if (colorValue.startsWith("var(")) {
    const varMatch = colorValue.match(/var\((--[^)]+)\)/);
    if (varMatch) {
      const resolved = resolveCssVariable(varMatch[1]);
      if (resolved && resolved.trim() !== "") {
        colorValue = resolved.trim();
      } else {
        // If we can't resolve, try using the CSS variable directly with browser parsing
        const hexResult = cssColorToHex(colorValue);
        // Ensure we return a valid hex (not empty string)
        return hexResult && hexResult.startsWith("#") ? hexResult : "#000000";
      }
    }
  }
  
  // If it's already a hex, normalize it (remove alpha if present)
  if (colorValue.startsWith("#")) {
    const hexResult = cssColorToHex(colorValue);
    return hexResult && hexResult.startsWith("#") ? hexResult : "#000000";
  }
  
  // If it's LAB format (from getComputedStyle), convert to hex
  if (colorValue.startsWith("lab(")) {
    const hexResult = cssColorToHex(colorValue);
    return hexResult && hexResult.startsWith("#") ? hexResult : "#000000";
  }
  
  // If it's oklch, convert to hex using browser's color parsing
  if (colorValue.startsWith("oklch")) {
    const hexResult = cssColorToHex(colorValue);
    return hexResult && hexResult.startsWith("#") ? hexResult : "#000000";
  }
  
  // For other formats (rgb, hsl), convert using browser's color parsing
  if (colorValue.match(/^(rgb|hsl|hwb|lab|lch)/i)) {
    const hexResult = cssColorToHex(colorValue);
    return hexResult && hexResult.startsWith("#") ? hexResult : "#000000";
  }
  
  // If we still have an unresolved value, try browser parsing anyway
  // This handles edge cases where the format isn't recognized
  const hexResult = cssColorToHex(colorValue);
  if (hexResult && hexResult.startsWith("#")) {
    return hexResult;
  }
  
  // Fallback - always return a valid hex
  return "#000000";
}

/**
 * Check if a string is a valid color format
 */
export function isValidColor(color: string): boolean {
  return (
    color.startsWith("#") ||
    color.startsWith("oklch") ||
    color.startsWith("rgb") ||
    color.startsWith("hsl")
  );
}

/**
 * Normalize color value to string for display
 * For CSS variables, we try to resolve through stylesheet to preserve oklch format
 * If that fails or returns LAB, we fall back to the original value
 */
export function normalizeColorToString(
  color: string | { oklch?: string; hex?: string }
): string {
  let colorValue: string;
  
  if (typeof color === "string") {
    // If it's already a direct color value (not a CSS variable), return it
    if (!color.startsWith("var(")) {
      return color;
    }
    
    // For CSS variables, try to resolve while preserving format
    colorValue = resolveColorValue(color, true);
    
    // If we got LAB format (from getComputedStyle fallback), prefer showing the CSS var
    // The user can see the actual color in the color picker swatch
    if (colorValue.startsWith("lab(")) {
      return color; // Return original CSS variable instead of LAB
    }
  } else {
    colorValue = color.oklch || color.hex || "";
  }
  
  return colorValue;
}

