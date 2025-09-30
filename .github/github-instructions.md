# Project Structure Guide

This document outlines the standard project structure for the Palo Training App, a Next.js application with TypeScript and Tailwind CSS.

## Overview

This is a modern web application built with:
- **Next.js 15.5.4** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **ESLint** - Code linting and formatting

## Project Structure

```
palo-training-app/
├── .github/                    # GitHub-specific files
│   └── github-instructions.md  # Project documentation
├── .git/                       # Git repository metadata
├── .gitignore                  # Files to ignore in version control
├── public/                     # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/                        # Source code
│   └── app/                    # Next.js App Router directory
│       ├── favicon.ico         # Site favicon
│       ├── globals.css         # Global styles and Tailwind imports
│       ├── layout.tsx          # Root layout component
│       └── page.tsx            # Home page component
├── node_modules/               # Installed dependencies (auto-generated)
├── eslint.config.mjs          # ESLint configuration
├── next-env.d.ts              # Next.js TypeScript declarations
├── next.config.ts             # Next.js configuration
├── package.json               # Project dependencies and scripts
├── package-lock.json          # Dependency lock file
├── postcss.config.mjs         # PostCSS configuration for Tailwind
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project overview
```

## Directory Details

### `/src/app/` - Application Code
The main application code following Next.js App Router conventions:

- **`layout.tsx`** - Root layout that wraps all pages
- **`page.tsx`** - Home page component (route: `/`)
- **`globals.css`** - Global styles and Tailwind CSS imports
- **`favicon.ico`** - Site favicon

### `/public/` - Static Assets
Static files served directly by the web server:
- Images, icons, fonts
- Files accessible at root URL (e.g., `/next.svg`)

### Configuration Files
- **`next.config.ts`** - Next.js framework configuration
- **`tsconfig.json`** - TypeScript compiler configuration
- **`eslint.config.mjs`** - ESLint rules and settings
- **`postcss.config.mjs`** - PostCSS configuration for Tailwind CSS
- **`package.json`** - Project metadata, dependencies, and scripts

## Recommended Extensions

When new directories are added, follow these conventions:

### `/src/app/` Structure
```
src/app/
├── (dashboard)/           # Route groups (don't affect URL)
├── api/                   # API routes
│   └── users/
│       └── route.ts
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── forms/            # Form components
├── lib/                  # Utility functions and configurations
│   ├── utils.ts
│   └── validations.ts
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── constants/            # Application constants
└── [dynamic]/           # Dynamic routes
    └── page.tsx
```

### Component Organization
```
components/
├── ui/                   # Base components (Button, Input, etc.)
│   ├── button.tsx
│   ├── input.tsx
│   └── index.ts         # Barrel exports
├── forms/               # Form-specific components
├── layout/              # Layout components (Header, Footer, etc.)
└── features/            # Feature-specific components
    └── auth/
        ├── login-form.tsx
        └── signup-form.tsx
```

## Naming Conventions

### Files and Directories
- **Components**: PascalCase (`LoginForm.tsx`)
- **Pages**: kebab-case (`user-profile/page.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

### Code
- **Variables/Functions**: camelCase (`getUserData`)
- **Types/Interfaces**: PascalCase (`UserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

## Scripts

Available npm scripts defined in `package.json`:

```bash
npm run dev        # Start development server with Turbopack
npm run build      # Build for production with Turbopack
npm run start      # Start production server
npm run lint       # Run ESLint
```

## Status Tracking Protocols

### Implementation Plan Status Updates
When working with implementation plans in `/docs/implementation-plans/`:

1. **Always update task status** after completing work:
   - `[ ]` Not Started
   - `[~]` In Progress  
   - `[x]` Completed
   - `[!]` Blocked

2. **Update story status** when all tasks in a story are complete
3. **Save changes** to the implementation plan file immediately
4. **Provide status summary** in your response for visibility

### Task Management
- Track dependencies between tasks
- Document blockers with clear descriptions
- Update progress regularly during development
- Communicate status changes to stakeholders

## Best Practices

### File Organization
1. **Group by feature** rather than file type when the app grows
2. **Use barrel exports** (`index.ts`) for cleaner imports
3. **Keep components small** and focused on single responsibility
4. **Co-locate related files** (component + styles + tests)

### Code Organization
1. **Use TypeScript strictly** - avoid `any` types
2. **Follow ESLint rules** - run linting before commits
3. **Use Tailwind utilities** - avoid custom CSS when possible
4. **Implement proper error boundaries** for React components

### Git Workflow
1. **Use meaningful commit messages**
2. **Create feature branches** for new development
3. **Review code** before merging to main
4. **Keep commits atomic** and focused

## Future Considerations

As the project grows, consider adding:

- **`/tests/`** - Test files and configurations
- **`/docs/`** - Additional documentation
- **`/scripts/`** - Build and deployment scripts
- **`/docker/`** - Docker configuration files
- **`.github/workflows/`** - CI/CD pipeline definitions

This structure provides a solid foundation for scaling the application while maintaining code organization and developer experience.
