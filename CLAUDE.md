# URANO PROJECT REFERENCE

## Build & Development Commands
- `npm run dev` - Start local development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint on all files
- `npm run preview` - Preview production build locally

## Code Style Guidelines
- React functional components with hooks
- JSX format for component files
- TailwindCSS for styling (avoid inline styles)
- Organize imports: React first, then third-party libraries, then local imports
- Components organized in layout/, pages/, and ui/ directories
- Use ThemeContext for dark/light theme functionality
- Component naming: PascalCase
- File naming: matches component name (e.g., Header.jsx)
- Variables: camelCase
- Use explicit returns for multi-line component returns
- Prefer destructuring for props
- Custom Conthrax font for headings
- Maintain consistent spacing with StarryBackground component