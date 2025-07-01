# NIAGADS GenomicsDB 

A comprehensive genomics data portal for Alzheimer's disease research, built with Next.js and pure CSS.

## Features

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Pure CSS** - Custom design system with CSS variables
- **Lucide React** - Icon library (only external dependency)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Create a new Next.js project:
\`\`\`bash
npx create-next-app@latest niagads-genomics-db --typescript --eslint --app --src-dir=false --import-alias="@/*"
cd niagads-genomics-db
\`\`\`

2. Install the icon library:
\`\`\`bash
npm install lucide-react@^0.263.1
\`\`\`

3. Replace the generated files with the ones from this project

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Project Structure

\`\`\`
├── app
│   ├── about
│   │   └── page.tsx
│   ├── browse-datasets
│   │   └── page.tsx
│   ├── genome-browser
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── records
│   │   └── [type]
│   │       └── [id]
│   ├── search
│   │   └── page.tsx
│   └── tutorials
│       └── page.tsx
├── components
│   ├── about-page.css
│   ├── about-page.tsx
│   ├── action-button.css
│   ├── browse-datasets-page.tsx
│   ├── conditional-main-layout.tsx
│   ├── enhanced-search-component.css
│   ├── enhanced-search-component.tsx
│   ├── error-page.css
│   ├── error-page.tsx
│   ├── footer.css
│   ├── footer.tsx
│   ├── genome-browser-page.tsx
│   ├── header.css
│   ├── header.tsx
│   ├── home-page.css
│   ├── home-page.tsx
│   ├── inline-error.tsx
│   ├── loading-context.tsx
│   ├── loading-spinner.tsx
│   ├── main-layout.tsx
│   ├── mobile-menu.css
│   ├── mobile-menu.tsx
│   ├── records
│   │   ├── gene-record.tsx
│   │   ├── placeholder.css
│   │   ├── placeholder.tsx
│   │   ├── record-page.tsx
│   │   ├── record-sidebar.css
│   │   ├── record-sidebar.tsx
│   │   ├── record.css
│   │   ├── records-list.css
│   │   ├── records-page.tsx
│   │   ├── span-record.tsx
│   │   ├── track-record.tsx
│   │   ├── types.ts
│   │   └── variant-record.tsx
│   ├── sidebar.css
│   ├── sidebar.tsx
│   ├── tab-navigation.css
│   ├── table.css
│   ├── tabs.tsx
│   ├── tooltip.css
│   ├── tooltip.tsx
│   ├── tutorials-page.css
│   └── tutorials-page.tsx
├── components.json
├── eslint.config.mjs
├── lib
│   ├── api
│   │   └── fetch-record-data.ts
│   └── search-router.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── public
│   ├── genomicsdb_logo.svg
│   ├── logo.png
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── README.md
└── tsconfig.json
\`\`\`

### Navigation Flow

1. **Home Page**: Landing page with search and feature highlights
2. **Browse Datasets Page**: Dataset selection and search interface
3. **Search Action**: Triggers navigation to Records page
4. **Records Page**: Shows search results with sidebar navigation
5. **Sidebar**: Only appears on Records page for filtering results

### Key Features

- **Pure CSS Design System**: No Tailwind or external CSS frameworks
- **Light Theme**: Professional white background with blue accents
- **Responsive Layout**: Works on all device sizes
- **Accessibility**: Full keyboard navigation and screen reader support
- **Minimal Dependencies**: Only essential packages included

## Development

### Styling Philosophy

- **CSS Custom Properties**: Consistent theming and easy customization
- **Semantic Class Names**: Clear, descriptive CSS classes
- **Mobile-First**: Responsive design starting from mobile
- **Performance**: Minimal CSS bundle size

### Adding New Features

1. Create component in `components/`
2. Add to routing logic in `app/page.tsx`
3. Update navigation if needed
4. Follow existing CSS patterns

## Deployment

Standard Next.js deployment:

\`\`\`bash
npm run build
npm start
\`\`\`

## License

MIT License
