# Project Midnight

A modern dashboard application built with Next.js 15, featuring authentication, calendar management, and reporting capabilities. This project leverages the latest React 19 features and includes a custom design system with a comprehensive UI component library.

## Features

- **Authentication System** - Complete auth flow with login, password reset, and forgot password pages
- **Dashboard** - Main dashboard with sidebar navigation and responsive layout
- **Calendar** - Calendar functionality for scheduling and event management
- **Reports** - Reporting and analytics section
- **Custom UI Library** - Built on shadcn/ui with custom Falcorp UI components
- **Responsive Design** - Mobile-first approach with drawer navigation on smaller screens

## Tech Stack

| Tech | Description | Read more |
|------|-------------|-----------|
| Next.js | React full stack framework | [Next.js Docs](https://nextjs.org/docs) |
| React | Frontend library with latest features | [React Docs](https://react.dev/) |
| TypeScript | Type-safe JavaScript | [TypeScript Docs](https://www.typescriptlang.org/docs/) |
| Tailwind CSS | CSS Framework | [Tailwind CSS Docs](https://tailwindcss.com/docs) |
| shadcn/ui | UI Component Library | [shadcn/ui Docs](https://ui.shadcn.com/) |
| Falcorp UI | Custom UI component registry | [Falcorp UI](https://falcorp-ui.vercel.app/) |
| Zustand | State management library | [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction) |

### Additional Libraries

- **class-variance-authority (CVA)** - Type-safe variant management for components
- **clsx** - Conditional className utility
- **tailwind-merge** - Merge Tailwind classes without conflicts
- **tw-animate-css** - Animation utilities for Tailwind
- **vaul** - Drawer component
- **react-day-picker** - Calendar/date picker
- **react-inlinesvg** - Inline SVG rendering
- **chrono-node** - Date parsing and manipulation

## Project Structure

### App Router Architecture

```
src/app/
├── (auth)/                 # Authentication route group (shared layout)
│   ├── login/             # Login page
│   ├── forgot-password/   # Forgot password page
│   ├── reset-password/    # Reset password page
│   └── layout.tsx         # Auth-specific layout
├── (dashboard)/           # Dashboard route group (shared layout)
│   ├── page.tsx          # Home/Dashboard page
│   ├── calendar/         # Calendar page
│   ├── reports/          # Reports page
│   └── layout.tsx        # Dashboard layout with sidebar
├── layout.tsx            # Root layout
├── globals.css           # Global styles and design tokens
├── not-found.tsx         # 404 page
└── global-error.tsx      # Global error boundary
```

### Component Organization

```
src/components/
├── ui/                          # shadcn/ui components
│   ├── button.tsx              # Base UI components use simple naming
│   ├── input.tsx
│   ├── avatar.tsx
│   ├── calendar.tsx
│   ├── drawer.tsx
│   ├── dropdown-menu.tsx
│   ├── label.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   ├── skeleton.tsx
│   ├── spinner.tsx
│   └── tooltip.tsx
├── app-sidebar/                 # Custom feature components
│   └── app-sidebar-component.tsx   # Use kebab-case folder + -component.tsx suffix
├── header/
│   └── header-component.tsx
├── footer/
│   └── footer-component.tsx
├── user-avatar/
│   └── user-avatar-component.tsx
└── inline-svg/
    └── inline-svg-component.tsx
```

### Other Directories

```
src/
├── lib/              # Utility functions
│   └── utils.ts     # Common utilities (cn, etc.)
├── hooks/           # Custom React hooks
│   └── use-mobile.ts
public/
├── icons/           # SVG icons
│   ├── outlined/
│   └── solid/
├── illustrations/   # Illustration assets
└── logos/          # Logo files
```

## Component Naming Conventions

### shadcn/ui Components (in `src/components/ui/`)
- **File naming**: `kebab-case.tsx` (e.g., `button.tsx`, `dropdown-menu.tsx`)
- **Export**: Named export matching the component name in PascalCase
- **Usage**: These are base UI primitives from shadcn/ui

Example:
```typescript
// src/components/ui/button.tsx
export function Button({ ... }) { ... }
```

### Custom Feature Components (in `src/components/[feature-name]/`)
- **Folder naming**: `kebab-case` (e.g., `app-sidebar/`, `user-avatar/`)
- **File naming**: `[folder-name]-component.tsx` (e.g., `app-sidebar-component.tsx`)
- **Export**: Named export in PascalCase matching feature name
- **Usage**: Feature-specific, composed components

Example:
```typescript
// src/components/page-header/page-header-component.tsx
export function PageHeader({ ... }) { ... }
```

### Creating New Components

#### For shadcn/ui Components:
```bash
npx shadcn@latest add [component-name]
```
This will automatically add components to `src/components/ui/` with proper configuration.

#### For Custom Components:
1. Create a new folder in `src/components/` with a descriptive kebab-case name
2. Create a file named `[folder-name]-component.tsx`
3. Export your component with a PascalCase name
4. Import using the path alias: `@/components/[folder-name]/[folder-name]-component`

Example:
```typescript
// Creating a new feature component
// src/components/notification-bell/notification-bell-component.tsx
export function NotificationBell() {
  return <div>...</div>;
}

// Importing in another file
import { NotificationBell } from '@/components/notification-bell/notification-bell-component';
```

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Linting

```bash
npm run lint
```

## Design System

The project uses a custom design system with CSS variables for:
- **Colors**: Navy, Blue, Cyan, Green, Yellow, Red, Gray palettes (100-900 shades)
- **Typography**: Custom font stacks with Roboto and Gabarito
- **Spacing**: Consistent spacing scale
- **Shadows**: 2xs through 2xl shadow utilities
- **Radius**: Customizable border radius tokens

All design tokens are defined in `src/app/globals.css` and can be accessed via Tailwind utilities or CSS variables.
