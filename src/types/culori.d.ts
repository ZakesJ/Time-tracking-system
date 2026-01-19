declare module 'culori' {
  export interface Color {
    mode: string;
    [key: string]: number | string | undefined;
  }

  export function parse(color: string): Color | undefined;
  export function formatHex(color: Color): string;
  export function formatRgb(color: Color): string;
  export function formatHsl(color: Color): string;
  export function formatOklch(color: Color): string;
}

