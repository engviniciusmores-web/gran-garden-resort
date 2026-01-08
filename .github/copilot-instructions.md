# Copilot Instructions for Gran Garden Resort

## Project Overview

This is **ObraControl** (Gran Garden Resort) - a complete construction management system (Sistema de Gestão de Obras) version 2.0, built with React, TypeScript, and AI integration. The system provides comprehensive tools for construction project management including BIM viewing, scheduling, materials control, daily work logs, and reporting.

### Tech Stack
- **Frontend Framework**: React 19.2+ with TypeScript 5.8+
- **Build Tool**: Vite 6.2+ (configured for GitHub Pages deployment)
- **Testing**: Vitest 2.1+ with React Testing Library
- **UI Components**: Custom components with Lucide React icons
- **State Management**: React hooks (no external state management library)
- **Styling**: CSS with dark mode support
- **AI Integration**: Google Generative AI (@google/genai)
- **Charts**: Recharts 3.5+
- **PWA**: Vite PWA plugin for offline support
- **Firebase**: For backend services

## Coding Standards

### TypeScript Guidelines
- **Always use explicit types** - avoid using `any` type
- Use TypeScript strict mode features
- Prefer interfaces over types for object shapes
- Use proper type imports: `import type { ... }`
- Configure compiler with experimental decorators enabled

### React Best Practices
- Use functional components with hooks (no class components)
- Follow React 19+ patterns and best practices
- Use proper dependency arrays in useEffect and useMemo
- Implement proper error boundaries where needed
- Keep components focused and single-responsibility

### Code Style
- Use meaningful variable and function names in Portuguese when appropriate (the project uses Portuguese for domain-specific terms)
- Follow consistent import ordering:
  1. React imports
  2. Third-party libraries
  3. Internal components
  4. Types/interfaces
  5. Utilities
  6. Assets
- Use descriptive comments only when logic is complex
- Prefer pure functions and immutable data patterns

### File Organization
- Components go in `/components` directory
- Utility functions in `/src/utils`
- Test data in `/src/data`
- Test files in `/src/test`
- Types in `types.ts` or component-specific `.d.ts` files
- Constants in `constants.ts`

## Project Structure

```
/
├── .github/              # GitHub configuration (this directory)
├── components/           # React components
├── src/
│   ├── data/            # Application data and mock data
│   ├── test/            # Test utilities and setup
│   └── utils/           # Utility functions
├── public/              # Static assets
├── dist/                # Build output (do not commit)
├── types.ts             # TypeScript type definitions
├── constants.ts         # Application constants
├── firebase.ts          # Firebase configuration
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
└── index.css            # Global styles
```

## Build, Test, and Validation

### Development
```bash
npm install              # Install dependencies
npm run dev              # Start development server on port 3000
```

### Building
```bash
npm run build            # Build for production
npm run preview          # Preview production build locally
```

### Testing
```bash
npm test                 # Run all tests with Vitest
npm run test:ui          # Open Vitest UI for interactive testing
npm run test:coverage    # Generate test coverage report
```

### Deployment
```bash
npm run deploy:github    # Build and deploy to GitHub Pages
```

### Before Submitting PRs
1. **Run tests**: Ensure all tests pass with `npm test`
2. **Build successfully**: Verify the build completes with `npm run build`
3. **Check types**: TypeScript compilation should have no errors
4. **Test in browser**: Verify changes work in development mode

## Key Features and Modules

1. **Dashboard** - Overview with metrics and charts
2. **Planejamento (Planning)** - Complete task management system
3. **Materiais (Materials)** - Inventory and materials request control
4. **Diário de Obra (Work Log)** - Daily construction logs with AI integration
5. **Base de Dados (Database)** - Document organization
6. **BIM Viewer** - 3D model visualization

## Important Restrictions and Guidelines

### DO NOT
- **Never use `any` type** - always define proper types
- **Do not commit sensitive data** - API keys go in `.env.local` (not committed)
- **Do not remove existing tests** - tests are critical for maintaining quality
- **Do not modify `.gitignore`** without good reason - it's properly configured
- **Avoid inline styles** - use CSS classes or styled components
- **Do not use deprecated React patterns** - no class components, no legacy context API
- **Do not commit build artifacts** - `dist/`, `node_modules/`, coverage files are gitignored

### DO
- **Write tests for new features** - follow existing test patterns in `src/test/`
- **Use environment variables** - access via `import.meta.env` in Vite
- **Follow accessibility guidelines** - use semantic HTML and ARIA when needed
- **Implement dark mode support** - the app supports dark/light themes
- **Maintain Portuguese terminology** - construction domain terms should remain in Portuguese
- **Use existing utilities** - check `src/utils/` before creating new helper functions
- **Keep dependencies minimal** - only add new packages if absolutely necessary

## Testing Standards

- Test files should be named `*.test.tsx` for components or `*.test.ts` for utilities
- Use React Testing Library for component tests
- Use Vitest for unit tests
- Follow the existing test setup in `src/test/setup.ts`
- Aim for meaningful test coverage (existing examples include Button component, date utilities, form validations)
- Test user interactions, not implementation details

## Version 2.0 Features

The current version includes:
- ✨ Dark mode toggle
- 🔍 Advanced search and filters
- 📊 Temporal evolution charts
- ⚡ Keyboard shortcuts (Ctrl/Cmd + K for search, Ctrl/Cmd + N for new task, etc.)
- 🔔 Deadline notifications
- 📥 Excel export functionality
- ✅ Robust form validations

## Environment Configuration

- `GEMINI_API_KEY` - Required for AI features (set in `.env.local`)
- Firebase configuration in `firebase.ts`
- Base path configured for GitHub Pages deployment: `/gran-garden-resort/`

## Documentation

Refer to these files for more details:
- `README.md` - Main project documentation
- `MELHORIAS.md` - Improvements and features documentation
- `CHANGELOG.md` - Version history
- `GUIA_USO.md` - User guide
- `DEPLOY.md` - Deployment instructions

## Additional Notes

- The project uses Brazilian Portuguese for domain-specific terminology and user-facing content
- The application is configured as a PWA with offline support
- Base URL is configured for GitHub Pages deployment
- Port 3000 is the default development server port
- The project includes Python scripts for data extraction (legacy, not part of main codebase)
