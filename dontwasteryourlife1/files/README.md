# Don't Waste Your Life - Web App (Fixed)

This is a clean, improved version of the Don't Waste Your Life interactive study guide.

## What Was Fixed

### 1. Page Numbers
- **Fixed**: All page numbers now match the printed book
- **How**: Added +2 to all page numbers throughout the book
- Example: Original page 12 → Now shows as Page 14 (correct for printed book)

### 2. Content Formatting
- **Fixed**: Consistent styling for headers, body text, and page markers
- **How**: Improved the content parser to properly handle markdown-style headers (`## Header`)
- Headers now render consistently throughout all chapters
- Body paragraphs have consistent spacing and styling

### 3. Page Markers
- **Fixed**: Clean, consistent appearance for all page markers
- **How**: Updated CSS with gradient styling and hover effects
- Page markers are now clickable and scroll smoothly into view
- Consistent [PAGE XX] format throughout

### 4. Overall Styling
- Clean, professional appearance
- Better typography and readability
- Improved mobile responsiveness
- Consistent colors and spacing

## Files Included

1. `index.html` - Main chapter list page
2. `reader.html` - Chapter reading page
3. `styles.css` - Complete styling (consistent throughout)
4. `app.js` - Chapter list functionality
5. `reader.js` - Reading page functionality (improved content parser)
6. `book-data-fixed.js` - Book data with corrected page numbers

## Installation

1. Copy all files to your web server or hosting location
2. Make sure all files are in the same directory
3. Open `index.html` in a web browser

## Features

- ✅ Page numbers match the printed book
- ✅ Consistent headers and formatting throughout
- ✅ Clickable page markers
- ✅ Adjustable text size (small/medium/large)
- ✅ Text-to-speech audio playback
- ✅ Reflection questions with auto-save
- ✅ Progress tracking
- ✅ Mobile-friendly responsive design

## Local Testing

To test locally, you can use:

```bash
# Python 3
python3 -m http.server 8000

# Then open: http://localhost:8000
```

Or simply open `index.html` in your browser (some features like text-to-speech may require a local server).

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Credits

Based on "Don't Waste Your Life" by John Piper
Web app developed for ministry use at Neighborhood Church

## Notes

- All progress and answers are saved locally in your browser
- No data is sent to any server
- Page numbers are now accurate to the printed book (+2 adjustment applied)
