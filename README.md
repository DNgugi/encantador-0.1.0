# Studio Encantador Website

Hong Kong boutique consulting agency website offering Business Consulting, Web Development, and Team Building services.

## Project Structure

```
src/
├── index.html              # Main English page
├── zh-hk/index.html       # Traditional Chinese page
├── zh-cn/index.html       # Simplified Chinese page
├── js/
│   └── main.js            # Main application entry
├── styles/
│   └── main.css           # Main stylesheet with Hong Kong cultural colors
├── components/            # Reusable UI components
├── assets/
│   ├── images/           # Optimized images and SVG illustrations
│   └── icons/            # Custom SVG icons
└── translations/
    ├── en.json           # English translations
    ├── zh-hk.json        # Traditional Chinese translations
    └── zh-cn.json        # Simplified Chinese translations
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Technology Stack

- **Build System**: Vite for fast development and optimized production builds
- **Testing**: Vitest with jsdom and Testing Library for DOM testing
- **Styling**: CSS with custom properties for Hong Kong cultural colors
- **Multi-language**: JSON-based translation system
- **Code Quality**: ESLint and Prettier for consistent code style

## Features

- Multi-language support (English, Traditional Chinese, Simplified Chinese)
- Hong Kong cultural color palette and design elements
- Responsive design optimized for mobile
- Performance optimized with code splitting and minification
- Comprehensive test coverage with TDD approach
- Modern ES6+ JavaScript with module system

## Build Optimization

- ES2015 target for broad browser compatibility
- Terser minification for smaller bundle sizes
- Source maps for debugging
- Multi-entry build for language-specific pages
- Asset optimization and caching
