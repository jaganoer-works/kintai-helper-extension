# Technology Stack

## Architecture

### High-Level System Design
- **Chrome Extension Architecture**: Built on Chrome Extension API v3 (Manifest V3)
- **Service Worker Pattern**: Background script operates as service worker for extension lifecycle management
- **Content Script Injection**: Scripts injected into web pages for DOM manipulation and automation
- **Message Passing System**: Communication between popup, background, and content scripts via Chrome runtime messaging
- **Storage-Based Configuration**: Settings persistence using Chrome Storage API

### Extension Components
- **Background Script**: Service worker handling extension lifecycle and inter-script messaging
- **Content Script**: Injected into target web pages for DOM analysis and form automation
- **Popup Interface**: User-facing configuration and execution interface
- **Manifest Configuration**: Chrome Extension v3 manifest defining permissions and entry points

## Frontend

### Core Technologies
- **TypeScript**: Primary development language providing type safety and modern ES features
- **Chrome Extension API**: Native browser extension APIs for storage, messaging, and script injection
- **DOM API**: Direct manipulation of web page elements and form controls
- **Chrome Storage API**: Persistent configuration storage across browser sessions

### UI Framework
- **Vanilla HTML/CSS/JavaScript**: Popup interface built with standard web technologies
- **No External Frameworks**: Self-contained implementation without React, Vue, or other dependencies
- **Chrome Extension Popup**: Native extension popup window with modern styling

### Build System
- **Webpack**: Module bundling and build orchestration
- **ts-loader**: TypeScript compilation within Webpack pipeline
- **ES2020 Target**: Modern JavaScript features with broad browser compatibility

## Development Environment

### Required Tools
- **Node.js**: JavaScript runtime for development tooling
- **npm**: Package management and script execution
- **TypeScript Compiler**: Type checking and transpilation
- **Chrome Browser**: Target runtime environment for testing
- **Chrome Developer Tools**: Extension debugging and development

### Development Dependencies
- **@types/chrome**: TypeScript definitions for Chrome Extension APIs
- **typescript**: ^5.3.3 - TypeScript compiler and language server
- **webpack**: ^5.89.0 - Module bundling and asset compilation
- **webpack-cli**: ^5.1.4 - Command-line interface for Webpack
- **ts-loader**: ^9.5.1 - TypeScript loader for Webpack

### TypeScript Configuration
- **Target**: ES2020 for modern JavaScript features
- **Module System**: ES2020 modules with CommonJS interop
- **Strict Mode**: Full TypeScript strict checking enabled
- **Source Maps**: Development debugging support
- **Declaration Files**: Type definition generation for API consistency

## Common Commands

### Build Commands
```bash
npm run build    # Production build with Webpack optimization
npm run dev      # Development build with watch mode for active development
npm run watch    # Development build with file watching for continuous compilation
```

### Development Workflow
```bash
# Initial setup
npm install      # Install all dependencies

# Development cycle
npm run dev      # Start development build with watching
# Load unpacked extension in Chrome
# Make code changes
# Extension auto-reloads on content/popup changes
# Reload extension manually for background script changes

# Production deployment
npm run build    # Create optimized production build
```

### Chrome Extension Development
- **Extension Loading**: `chrome://extensions/` → Enable Developer mode → Load unpacked
- **Hot Reload**: Automatic reload for content scripts and popup changes
- **Manual Reload**: Required for background script and manifest changes
- **Debug Access**: Chrome DevTools integration for all extension components

## Environment Variables

### Build Environment
- **NODE_ENV**: Controls build mode and optimization level
- **Webpack Mode**: Set via CLI arguments (production/development)

### Runtime Configuration
- **Chrome Storage**: All user configuration stored in Chrome's sync storage
- **No External APIs**: No environment variables for external service configuration
- **Local Processing**: All operations performed locally within browser context

## Port Configuration

### No Network Services
- **Local Operation**: Extension operates entirely within browser context
- **No Server Requirements**: No backend services or network ports needed
- **Client-Side Only**: All processing happens in browser without external communication

## Architecture Patterns

### Chrome Extension Patterns
- **Content Script Pattern**: Safe injection into web pages with isolated execution context
- **Service Worker Background**: Event-driven background processing with Chrome Extension API v3
- **Storage-First Configuration**: Settings persistence using Chrome's built-in storage mechanisms
- **Permission-Based Access**: Broad host permissions for flexibility across attendance systems

### DOM Interaction Strategy
- **Multi-Selector Fallback**: Multiple selector patterns for robust element detection
- **MutationObserver Integration**: Real-time DOM change monitoring for dynamic content
- **Event-Driven Updates**: Proper form validation event firing for framework compatibility
- **Timing Control**: Sophisticated retry and delay mechanisms for reliable automation

### Security Model
- **Sandboxed Execution**: Content scripts operate in isolated context from page scripts
- **Permission-Based Access**: Explicit host permissions required for each domain
- **No External Communication**: Zero external API calls or data transmission
- **Local Storage Only**: All data remains within browser's secure storage system

### Error Handling Architecture
- **Graceful Degradation**: Continues processing when individual elements fail
- **Comprehensive Logging**: Detailed error reporting and processing status tracking
- **Retry Mechanisms**: Automatic retry for transient failures with exponential backoff
- **User Feedback**: Clear error messaging and troubleshooting guidance