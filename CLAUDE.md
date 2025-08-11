# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension for automating attendance input in Japanese attendance management systems. The extension is built with TypeScript and uses Chrome Extension API v3 to inject scripts into web pages and automate form filling.

## Common Development Commands

### Build Commands
```bash
npm run build    # Production build with Webpack
npm run dev      # Development build with watch mode
npm run watch    # Development build with file watching
```

### Testing
The project does not currently have a test framework configured. Manual testing is done by loading the unpacked extension in Chrome.

### Chrome Extension Development
1. Load unpacked extension: `chrome://extensions/` → Enable Developer mode → Load unpacked
2. Reload extension after changes to manifest.json or background scripts
3. Reload web page after changes to content scripts

## Architecture Overview

### Core Components

**Background Script** (`src/background.ts`)
- Service worker for Chrome Extension API v3
- Handles extension lifecycle and messaging

**Content Script** (`src/content.ts`) 
- Injected into web pages to interact with DOM
- Communicates with popup and executes attendance automation

**Popup Interface** (`src/popup.ts`, `popup.html`)
- User interface for configuration and execution
- Stores settings in Chrome storage API

**Attendance Service** (`src/services/attendanceService.ts`)
- Core business logic for attendance automation
- Handles DOM parsing, form field detection, and data input
- Implements robust timing controls and retry mechanisms

### Key Architecture Patterns

**DOM Interaction Strategy**
- Uses multiple selector patterns to handle different attendance system layouts
- Implements timing controls with MutationObserver and retry mechanisms
- Handles dynamic DOM generation and async UI frameworks

**Configuration Management**
- Settings stored in Chrome storage API for persistence
- Type-safe configuration with TypeScript interfaces
- Granular control over which fields to process and skip existing data

**Error Handling**
- Comprehensive logging system with configurable levels
- Graceful degradation when elements are not found
- Detailed result reporting for debugging

### Data Flow

1. User configures settings in popup
2. Settings saved to Chrome storage
3. Content script receives execution message
4. AttendanceService analyzes page DOM structure
5. Service processes each attendance row with timing controls
6. Results are logged and reported back to user

### Key Types

Located in `src/types/index.ts`:
- `AttendanceConfig`: Main configuration interface with time settings and field controls
- `ProcessResult`: Detailed execution results with success/error counts
- `TargetRow`: Represents a row in the attendance table
- `AttendanceData`: JSON data structure from attendance systems

## Development Notes

### Timing Issues Resolution
The project specifically addresses timing problems common in web automation:
- DOM elements loading asynchronously
- JavaScript framework interference (React/Vue)
- Form validation and event handling requirements

### Field Detection Strategy
Uses comprehensive selector patterns to handle various attendance system layouts:
- Multiple input field selectors (name attributes, placeholders, titles)
- Flexible table column detection
- Attendance type classification parsing

### Browser Compatibility
- Built for Chrome Extension API v3
- Uses modern TypeScript/ES2020 features
- Requires host permissions for broad site access (`*://*/*`)

### Security Considerations
- Extension has broad host permissions for flexibility
- No external API calls or data transmission
- All processing happens locally in browser