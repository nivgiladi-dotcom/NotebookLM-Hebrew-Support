# NotebookLM Hebrew RTL Support Chrome Extension

A Chrome Extension that adds RTL (Right-to-Left) support for Hebrew text in NotebookLM while preserving math formulas and LaTeX in LTR (Left-to-Right).

## Features

- **RTL Support**: Automatically detects Hebrew text and applies RTL styling
- **Math Protection**: Keeps math formulas, LaTeX, and code blocks in LTR
- **Dynamic Rendering**: Uses MutationObserver to handle dynamically loaded content
- **Scoped Targeting**: Only affects main content areas, preserves Google navigation

## Files

- `manifest.json`: Extension configuration (Manifest V3)
- `content.js`: JavaScript logic for dynamic RTL/LTR handling
- `styles.css`: CSS rules for RTL and math protection
- `README.md`: This documentation

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `chrome-extension` directory
5. Navigate to `notebooklm.google.com` to test

## Technical Details

### CSS Logic
- Sets `direction: rtl` and `text-align: right` for text containers
- Uses `unicode-bidi: isolate` to prevent text-wrapping issues
- Protects math elements with `direction: ltr !important` and `display: inline-block`

### JavaScript Logic
- Detects Hebrew text using regex `/[\u0590-\u05FF]/`
- Uses MutationObserver for dynamic content
- Excludes navigation, header, and sidebar areas
- Processes both existing and dynamically added content

### Targeted Elements
- **RTL Applied**: `.markdown-rendered`, `.chat-message`, `.note-content`, `.ng-star-inserted`, `[data-start-index]`
- **LTR Protected**: `.katex`, `.math`, `.mjx-container`, `code`, `pre`, `.latex`
- **Excluded**: `header`, `nav`, `.sidebar`, `.nav-bar`, `.top-bar`

## Compatibility

- Chrome 88+ (Manifest V3 support)
- NotebookLM (notebooklm.google.com)
- Works with dynamically loaded chat messages and notes
