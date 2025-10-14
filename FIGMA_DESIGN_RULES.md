# Figma Design System Integration Rules

## Project Overview

**ITDA (잇다)** is an educational platform for teachers to share teaching materials. This document provides comprehensive design system rules for integrating Figma designs using the Model Context Protocol (MCP).

---

## 1. Design Tokens

### Color Palette

The codebase uses a limited color palette with primary brand colors:

```css
/* Primary Brand Color */
--primary-color: #0e97c4;       /* Main brand color */
--primary-hover: #0c7fa8;       /* Hover state */
--primary-light: #1890ff;       /* Ant Design primary */

/* Background Colors */
--background-main: #f5f5f5;     /* Main background */
--background-card: #fff;        /* Card/component background */
--background-hover: #f8f8f8;    /* Hover background */
--background-disabled: #f0f0f0; /* Disabled state */

/* Text Colors */
--text-primary: #333;           /* Primary text */
--text-secondary: #666;         /* Secondary text */
--text-tertiary: #999;          /* Tertiary/disabled text */
--text-dark: #1a202c;          /* Dark headings */
--text-muted: #4a5568;         /* Muted text */

/* Border Colors */
--border-light: #eee;           /* Light borders */
--border-medium: #ddd;          /* Medium borders */

/* Utility Colors */
--error-color: #ff4444;         /* Error/notification badge */
--dark-background: #001529;     /* Footer/dark sections */
--button-dark: #333;            /* Dark buttons */
```

**Location**:
- Global: `front/src/index.css:20`
- App-level: `front/src/App.css`
- Component-level: Individual CSS files in component folders

### Typography

```typescript
/* Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

/* Code Font */
font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;

/* Font Sizes */
--font-size-xs: 11px;    /* Logo subtitle */
--font-size-sm: 12px;    /* Small text, badges */
--font-size-base: 13px;  /* Card content */
--font-size-md: 14px;    /* Default text, buttons */
--font-size-lg: 16px;    /* Menu items, subtitles */
--font-size-xl: 18px;    /* Section titles */
--font-size-2xl: 20px;   /* Page headings */
--font-size-3xl: 28px;   /* Logo */

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Line Heights */
--line-height-tight: 1.15;
--line-height-normal: 1.4;
--line-height-relaxed: 1.6;
```

**Location**: `front/src/index.css:8-26`

### Spacing System

```css
/* Spacing Scale (based on usage in codebase) */
--spacing-xs: 4px;
--spacing-sm: 6px;
--spacing-md: 8px;
--spacing-lg: 12px;
--spacing-xl: 16px;
--spacing-2xl: 20px;
--spacing-3xl: 24px;
--spacing-4xl: 30px;
--spacing-5xl: 32px;
--spacing-6xl: 40px;
--spacing-7xl: 60px;

/* Component Spacing */
--padding-button: 10px 16px;    /* Standard button padding */
--padding-card: 24px;           /* Card padding */
--padding-header: 0 20px;       /* Header horizontal padding */
--gap-small: 8px;               /* Small gaps */
--gap-medium: 12px;             /* Medium gaps */
--gap-large: 16px;              /* Large gaps */
--gap-xl: 20px;                 /* Extra large gaps */
```

**Location**: Various component CSS files

### Border Radius

```css
--radius-sm: 4px;     /* Buttons, small elements */
--radius-md: 6px;     /* Ant Design default */
--radius-lg: 8px;     /* Cards, containers */
--radius-xl: 20px;    /* Pills, tags */
--radius-full: 50%;   /* Circles (profile images) */
--radius-round: 24px; /* Rounded search bar */
```

**Location**: `front/src/main.tsx:22` (Ant Design config) and component CSS files

### Shadows

```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);      /* Header shadow */
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);     /* Dropdown shadow */
--shadow-lg: 0 8px 25px rgba(0, 0, 0, 0.15);    /* Hover card shadow */
```

**Location**: `front/src/App.css:10`, `front/src/components/Header/Header.css:230`

---

## 2. Component Library

### Component Structure

Components follow a **feature-based organization** with co-located styles:

```
front/src/components/
├── ComponentName/
│   ├── ComponentName.tsx    # Component logic
│   └── ComponentName.css    # Component styles
└── SimpleComponent.tsx      # Simple components (single file)
```

**Example**:
- `front/src/components/Header/Header.tsx`
- `front/src/components/Header/Header.css`

### Component Architecture Pattern

**Technology**: React 19.1.1 + TypeScript 5.8.3

**Component Pattern**:
```typescript
// Standard functional component with TypeScript
import { useState } from 'react';
import './ComponentName.css';

interface ComponentNameProps {
  // Props definition
  userInfo?: {
    name: string;
    profileImage: string;
    messageCount: number;
  };
}

export const ComponentName = ({ userInfo }: ComponentNameProps) => {
  const [state, setState] = useState<Type>(initialValue);

  // Component logic

  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};
```

**Example**: `front/src/components/Header/Header.tsx:6-214`

### Key Components

1. **Header** (`front/src/components/Header/`)
   - Sticky navigation with logo, menu, search, and user profile
   - Dropdown menus with hover effects
   - Pattern: Fixed positioning with z-index layering

2. **Footer** (`front/src/components/Footer.tsx`)
   - Dark background footer with copyright info

3. **UserProfile** (`front/src/components/UserProfile/`)
   - User information card with profile image and stats

4. **MyStorage** (`front/src/components/MyStorage/`)
   - Storage statistics and content counters

5. **ContentList** (`front/src/components/ContentList/`)
   - Grid-based content listing with cards
   - Supports filtering by categories

### Component Naming Conventions

- **Component Names**: PascalCase (e.g., `Header`, `UserProfile`)
- **CSS Classes**: kebab-case (e.g., `header-content`, `news-card`)
- **File Names**: Match component name (e.g., `Header.tsx`, `Header.css`)

---

## 3. Frameworks & Libraries

### UI Framework

**React 19.1.1** with TypeScript 5.8.3

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "typescript": "^5.8.3"
}
```

### Component Library

**Ant Design 5.12.5** - Primary UI component library

```typescript
// Configuration in main.tsx
import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';

const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
    fontSize: 14,
  },
};

<ConfigProvider locale={koKR} theme={theme}>
  <App />
</ConfigProvider>
```

**Location**: `front/src/main.tsx:19-34`

**Usage**: Ant Design is used for complex UI components (Layout, Menu, etc.) but most custom components use plain CSS.

### Styling Library

**Styled Components 6.1.6** - CSS-in-JS (installed but minimal usage)

**Primary Approach**: Plain CSS files with component co-location

### State Management

**React Query** (`@tanstack/react-query` 5.8.4) - Server state management

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

**Location**: `front/src/main.tsx:10-17`

**Zustand** (4.4.7) - Client state management (installed, minimal usage)

### Routing

**React Router DOM** 6.20.1

```typescript
import { BrowserRouter, Link } from 'react-router-dom';

// Usage
<Link to="/path">Link Text</Link>
```

### HTTP Client

**Axios** 1.6.2 - API requests

**Location**: `front/src/services/apiService.ts`, `front/src/services/api.ts`

### Build System

**Vite 7.1.7** - Build tool and dev server

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 15173,
    watch: { usePolling: true },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

**Location**: `front/vite.config.ts`

---

## 4. Asset Management

### Asset Storage

**Location**: `front/public/`

**Structure**:
```
front/public/
└── default-thumbnail.png   # Default image assets
```

### Asset Reference Pattern

Assets in the public folder are referenced with absolute paths:

```typescript
// From public folder
<img src="/default-thumbnail.png" alt="..." />
<img src="/asset2/user/images/main/icon_setting.svg" alt="..." />
```

### Image Handling Utilities

**Utility File**: `front/src/utils/imageUtils.ts`

```typescript
// Default images
export const DEFAULT_IMAGES = {
  thumbnail: '/default-thumbnail.png',
  profile: '/default-profile.png',
  logo: '/default-logo.png',
};

// Error handling
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>,
  defaultImage: string = DEFAULT_IMAGES.thumbnail
) => {
  const img = event.currentTarget;
  if (img.src !== defaultImage) {
    img.src = defaultImage;
  }
};

// SVG fallbacks
export const createDefaultThumbnail = (text: string = 'No Image'): string => {
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="Arial" font-size="18" fill="#999"
            text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};
```

**Location**: `front/src/utils/imageUtils.ts:1-57`

### Image Usage Pattern

```typescript
import { handleImageError, createDefaultThumbnail, DEFAULT_PROFILE_SVG } from '@/utils/imageUtils';

// In component
<img
  src={imageUrl || createDefaultThumbnail('No Image')}
  alt="Description"
  onError={(e) => handleImageError(e, createDefaultThumbnail('Fallback'))}
/>
```

### Asset Optimization

- **Format**: PNG for static images, SVG for icons
- **CDN**: References to external CDN at `/asset2/user/images/`
- **Lazy Loading**: No explicit lazy loading implemented yet

---

## 5. Icon System

### Icon Library

**Ant Design Icons** 5.2.6

```typescript
import { IconName } from '@ant-design/icons';

// Usage example
<SearchOutlined />
<UserOutlined />
<SettingOutlined />
```

**Location**: Imported where needed in components

### Custom Icons

Custom icons are stored as SVG files in the public assets folder:

```
/asset2/user/images/
├── main/
│   └── icon_setting.svg
└── arrow-right.svg
```

**Usage**:
```typescript
<img src="/asset2/user/images/main/icon_setting.svg" alt="설정" />
<img src="/asset2/user/images/arrow-right.svg" alt="상세보기" />
```

### Icon Sizing Pattern

```css
/* Standard icon size in buttons */
.button img {
  width: 16px;
  height: 16px;
}

/* Profile icon */
.btn-profile {
  width: 42px;
  height: 42px;
  border-radius: 50%;
}

/* Badge icon */
.btn-alim .badge {
  font-size: 11px;
}
```

**Location**: `front/src/pages/MainPage/MainPage.css:231-234`, `front/src/components/Header/Header.css:215-220`

### Icon Naming Convention

- **Ant Design**: Use semantic names (e.g., `SearchOutlined`, `SettingFilled`)
- **Custom SVGs**: Descriptive kebab-case (e.g., `icon_setting.svg`, `arrow-right.svg`)

---

## 6. Styling Approach

### CSS Methodology

**Primary**: **Plain CSS with BEM-like naming** (Block Element Modifier inspired)

**Pattern**:
```css
/* Block */
.component-name { }

/* Element */
.component-name-element { }

/* Modifier */
.component-name--modifier { }
.component-name.active { }
```

**Example**:
```css
.header { }
.header-inner { }
.header-content { }
.header-content li:hover { }
.header-content li.active { }
```

**Location**: All component CSS files

### CSS Organization

**Structure**:
1. **Global Styles** (`front/src/index.css`): CSS reset, global utilities, Ant Design overrides
2. **App Styles** (`front/src/App.css`): App-level layout, utility classes
3. **Component Styles**: Co-located CSS files per component

### Global Styles

**File**: `front/src/index.css`

**Contains**:
- CSS Reset
- Font definitions
- Ant Design customizations
- Custom scrollbar styles
- Loading spinner
- Animation keyframes (fadeIn, slideUp)
- Responsive breakpoints

```css
/* Ant Design Customizations */
.ant-layout-header {
  padding: 0 !important;
}

.ant-menu-horizontal {
  border-bottom: none !important;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
```

**Location**: `front/src/index.css:28-59`

### Utility Classes

**File**: `front/src/App.css`

```css
/* Typography utilities */
.section-title { color: #1a202c; font-weight: 700; margin-bottom: 16px; }
.section-subtitle { color: #4a5568; font-size: 16px; line-height: 1.6; }
.text-center { text-align: center; }

/* Spacing utilities */
.mb-16 { margin-bottom: 16px; }
.mb-24 { margin-bottom: 24px; }
.mb-32 { margin-bottom: 32px; }
.mt-16 { margin-top: 16px; }
.mt-24 { margin-top: 24px; }
.mt-32 { margin-top: 32px; }

/* Responsive utilities */
.mobile-hidden { display: none !important; }  /* max-width: 768px */
.desktop-hidden { display: none !important; } /* min-width: 769px */
.mobile-full-width { width: 100% !important; }
```

**Location**: `front/src/App.css:50-107`

### Hover Effects Pattern

```css
/* Card hover */
.hover-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Link hover */
.menu-button {
  transition: color 0.2s;
}

.menu-button:hover {
  color: #0e97c4;
}
```

### Responsive Design Implementation

**Breakpoints**:
```css
/* Mobile */
@media (max-width: 768px) {
  /* Mobile-specific styles */
}

/* Desktop */
@media (min-width: 769px) {
  /* Desktop-specific styles */
}
```

**Location**: Used in `front/src/index.css:70-74`, `front/src/App.css:93-107`, component CSS files

**Pattern**: Mobile-first with desktop overrides

### Animation Classes

```css
/* Fade in animation */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide up animation */
.slide-up {
  animation: slideUp 0.3s ease-in-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Location**: `front/src/index.css:76-105`

### Styled Components Usage

**Status**: Installed but **NOT actively used**

**Recommendation**: Continue with plain CSS files for consistency

---

## 7. Project Structure

### Overall Organization

```
output_sample/
├── front/                      # React Frontend Application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Header/       # Component folder with CSS
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Header.css
│   │   │   ├── ContentList/
│   │   │   ├── MyStorage/
│   │   │   ├── UserProfile/
│   │   │   └── Footer.tsx    # Simple component (single file)
│   │   │
│   │   ├── pages/            # Page-level components
│   │   │   ├── MainPage/     # Page with styles
│   │   │   │   ├── MainPage.tsx
│   │   │   │   └── MainPage.css
│   │   │   ├── HomePage.tsx
│   │   │   └── LoginPage.tsx
│   │   │
│   │   ├── services/         # API services & mock data
│   │   │   ├── apiService.ts
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── mockData.ts
│   │   │
│   │   ├── contexts/         # React Context providers
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── hooks/            # Custom React hooks
│   │   │
│   │   ├── store/            # State management (Zustand)
│   │   │
│   │   ├── types/            # TypeScript type definitions
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/            # Utility functions
│   │   │   └── imageUtils.ts
│   │   │
│   │   ├── api/              # API client configuration
│   │   │
│   │   ├── App.tsx           # Root component
│   │   ├── App.css           # App-level styles
│   │   ├── main.tsx          # Application entry point
│   │   ├── index.css         # Global styles
│   │   └── vite-env.d.ts     # Vite type declarations
│   │
│   ├── public/               # Static assets
│   │   └── default-thumbnail.png
│   │
│   ├── package.json          # Dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   ├── vite.config.ts        # Vite build configuration
│   ├── Dockerfile            # Frontend Docker setup
│   └── .env                  # Environment variables
│
├── back/                     # Spring Boot Backend (Java 17)
├── web/                      # Nginx configuration
├── bin/                      # Shell scripts for deployment
├── docker-compose.yml        # Docker orchestration
└── README.md                 # Project documentation
```

### Path Aliases (TypeScript)

```json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["src/*"],
    "@/components/*": ["src/components/*"],
    "@/pages/*": ["src/pages/*"],
    "@/hooks/*": ["src/hooks/*"],
    "@/utils/*": ["src/utils/*"],
    "@/types/*": ["src/types/*"],
    "@/api/*": ["src/api/*"]
  }
}
```

**Location**: `front/tsconfig.json:24-33`

**Usage**:
```typescript
import { Header } from '@/components/Header/Header';
import { UserInfo } from '@/types';
import { handleImageError } from '@/utils/imageUtils';
```

### Feature Organization Pattern

**Components**: Feature-based with co-located styles
**Pages**: Page components that compose multiple components
**Services**: API calls and data fetching logic
**Types**: Centralized TypeScript interfaces

---

## 8. Figma-to-Code Workflow

### Design Import Process

When importing designs from Figma:

1. **Extract Design Tokens** from Figma:
   - Map Figma colors to CSS custom properties
   - Map Figma text styles to typography tokens
   - Map Figma spacing/layout grids to spacing scale

2. **Component Creation**:
   ```
   a. Create component folder: front/src/components/ComponentName/
   b. Create ComponentName.tsx with TypeScript interface
   c. Create ComponentName.css with BEM-like classes
   d. Export component from index
   ```

3. **Styling Guidelines**:
   - Use plain CSS files (not styled-components)
   - Follow BEM-like naming: `component-name`, `component-name-element`
   - Use CSS custom properties for colors and spacing
   - Include hover states with 0.2s-0.3s transitions
   - Include responsive breakpoints (768px)

4. **Image Assets**:
   - Export image assets from Figma
   - Place in `front/public/` folder
   - Reference with absolute paths: `/asset-name.png`
   - Use `imageUtils` for error handling and fallbacks

5. **Icons**:
   - Check if Ant Design Icons has the icon first
   - If custom, export SVG from Figma to `public/` folder
   - Size icons consistently (16px for buttons, 42px for avatars)

### Component Template

```typescript
// ComponentName.tsx
import { useState } from 'react';
import './ComponentName.css';

interface ComponentNameProps {
  title: string;
  // Add more props
}

export const ComponentName = ({ title }: ComponentNameProps) => {
  const [state, setState] = useState<Type>(initialValue);

  return (
    <div className="component-name">
      <div className="component-name-header">
        <h2>{title}</h2>
      </div>
      <div className="component-name-content">
        {/* Content */}
      </div>
    </div>
  );
};
```

```css
/* ComponentName.css */
.component-name {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.component-name-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.component-name-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.component-name-content {
  /* Content styles */
}

/* Responsive */
@media (max-width: 768px) {
  .component-name {
    padding: 16px;
  }
}
```

### Type Definition Pattern

Add types to `front/src/types/index.ts`:

```typescript
export interface NewType {
  id: string;
  name: string;
  // Add fields
}
```

---

## 9. Best Practices for Figma MCP Integration

### When Converting Figma Designs:

1. **Color Mapping**:
   - Map Figma primary colors to `#0e97c4`
   - Map secondary colors to grays (#333, #666, #999)
   - Use white (#fff) for cards/containers
   - Use #f5f5f5 or #f8f8f8 for backgrounds

2. **Typography**:
   - Map Figma text styles to existing font sizes (11px - 28px)
   - Use font-weight: 600 for headings, 400-500 for body
   - Maintain 1.4-1.6 line-height for readability

3. **Spacing**:
   - Use spacing scale: 4px, 6px, 8px, 12px, 16px, 20px, 24px, 32px, 40px
   - Card padding: 24px
   - Button padding: 10px 16px
   - Section gaps: 16px-20px

4. **Border Radius**:
   - Cards: 8px
   - Buttons: 4px
   - Pills/Tags: 20px
   - Avatars: 50% (circular)
   - Search bars: 24px

5. **Responsive Design**:
   - Mobile breakpoint: max-width 768px
   - Use flexbox/grid for layouts
   - Stack elements vertically on mobile
   - Adjust font sizes and padding for mobile

6. **Interactions**:
   - Add hover states with color/transform changes
   - Use 0.2s-0.3s transition durations
   - Cursor pointer for interactive elements
   - Box-shadow on hover for cards

7. **Accessibility**:
   - Include alt text for images
   - Use semantic HTML (header, nav, main, section)
   - Label form inputs
   - Maintain color contrast ratios

8. **Image Handling**:
   - Always use `handleImageError` from imageUtils
   - Provide fallback images/SVGs
   - Use object-fit: cover for thumbnails
   - Maintain aspect ratios (16:9 for thumbnails)

---

## 10. Technical Constraints & Considerations

### Browser Support
- Modern browsers (ES2020 target)
- Chrome, Firefox, Safari, Edge

### Performance
- Code splitting via Vite
- React Query for caching API responses
- Image optimization required for production

### Development Environment
- Docker-based (port 15173)
- Hot module replacement via Vite
- TypeScript strict mode enabled

### Backend Integration
- REST API endpoints via Axios
- Mock data for development: `front/src/services/mockData.ts`
- API service layer: `front/src/services/apiService.ts`

### Internationalization
- Korean locale configured: `antd/locale/ko_KR`
- No i18n library currently (Korean only)

---

## 11. Quick Reference Commands

### Development
```bash
cd front
npm run dev          # Start dev server (port 15173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Docker
```bash
./bin/manage.sh start frontend  # Start frontend container
docker logs -f itda-frontend    # View logs
```

---

## Summary for AI/MCP Code Generation

When generating code from Figma designs for this project:

✅ **DO**:
- Use plain CSS files with BEM-like naming
- Create TypeScript interfaces for props
- Use Ant Design components where appropriate
- Include hover states and transitions
- Add responsive breakpoints (768px)
- Use the color palette (#0e97c4 primary)
- Reference images with absolute paths
- Use imageUtils for error handling
- Follow the component folder structure
- Export named exports (not default)

❌ **DON'T**:
- Use styled-components (installed but not used)
- Use inline styles
- Use default exports
- Hard-code colors (use tokens)
- Skip TypeScript types
- Forget mobile responsiveness
- Use arbitrary spacing values

---

**Document Version**: 1.0
**Last Updated**: 2025-10-14
**Project**: ITDA Educational Platform
