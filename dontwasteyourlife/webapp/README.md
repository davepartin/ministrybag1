# Don't Waste Your Life - Interactive Study Webapp

A beautiful, feature-rich web application for reading and studying John Piper's transformative book "Don't Waste Your Life."

## Features

### 📚 Reading Experience
- **Clean, distraction-free interface** optimized for deep reading and reflection
- **3 text sizes** (Small, Medium, Large) - adjustable to your preference
- **Chapter navigation** with progress tracking
- **Page markers** showing original book page numbers
- **Jump to page** dropdown for quick navigation

### 🎧 Audio Features
- **Text-to-Speech** - Listen to any chapter with high-quality voice synthesis
- **Playback controls** - Play, Pause, Stop
- **Speed control** - Adjust reading speed from 0.75x to 2x
- **Jump to page** while listening

### 💭 Reflection & Study
- **5 thoughtful questions per chapter** designed to help you deeply engage with the content
- **Auto-save answers** - Your reflections are saved automatically as you type
- **Progress tracking** - See how many questions you've answered per chapter
- **Character count** - Track the depth of your responses
- **Email your answers** - Send your reflections to yourself or others
- **Clear answers** - Option to start fresh on any chapter

### 📱 Mobile Friendly
- Fully responsive design works perfectly on phones, tablets, and desktops
- Touch-optimized controls
- Your progress syncs across devices using localStorage

### 🎨 Beautiful Design
- Modern, clean interface with gradient backgrounds
- Smooth animations and transitions
- Visual progress indicators
- Chapter completion badges
- Professional typography optimized for reading

## How to Use

### Getting Started
1. Open `index.html` in any modern web browser
2. You'll see all chapters listed with progress indicators
3. Click any chapter to start reading

### Reading a Chapter
1. **Adjust text size**: Click the "A" button in the top-right
2. **Listen**: Click the headphone icon to enable audio features
3. **Navigate**: Use the "Jump to page" dropdown to move through the chapter
4. **Take notes**: Scroll to the reflection questions at the bottom

### Reflection Questions
1. Read through the chapter thoughtfully
2. Scroll to the reflection section
3. Type your answers in the text boxes (they save automatically)
4. Click "Email My Answers" to send your reflections
5. Click "Clear All Answers" to reset (careful - this can't be undone!)

### Audio Listening
1. Click the headphone icon in the navigation
2. Click "Play" to start listening
3. Adjust speed with the speed dropdown
4. Use "Jump to" to skip to specific pages
5. Click "Stop" to reset to the beginning

## File Structure

```
webapp/
├── index.html          # Home page with chapter list
├── reader.html         # Chapter reading page
├── styles.css          # All styling
├── app.js             # Home page functionality
├── reader.js          # Reader page functionality
├── book-data.js       # Extracted book content and questions
├── parse-book.js      # Script to regenerate book-data.js
└── README.md          # This file
```

## Technical Details

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Uses HTML5 localStorage for saving progress
- Uses Web Speech API for text-to-speech

### Data Storage
All your data is stored locally on your device using localStorage:
- **dwyl_text_size** - Your text size preference
- **dwyl_answers** - All your reflection answers

Your data is never sent to any server. Everything stays on your device.

### Privacy
This webapp runs entirely in your browser. No data is collected, tracked, or sent anywhere. The "Email" feature simply opens your default email client with pre-filled content.

## Customization

### Regenerating Book Data
If you want to update the book content or questions:

```bash
node parse-book.js
```

This will regenerate `book-data.js` from the source text file.

### Modifying Questions
Edit the `reflectionQuestions` object in `parse-book.js` and regenerate.

### Styling
All visual styling is in `styles.css` using CSS custom properties (variables) for easy theming.

## Study Tips

1. **Read slowly** - This book is dense with meaning. Take your time.
2. **Use audio for review** - Listen while commuting or exercising
3. **Answer honestly** - The reflection questions are for your growth
4. **Email yourself** - Create a journal of your spiritual journey
5. **Re-read chapters** - Come back to chapters that spoke to you
6. **Share answers** - Email your reflections to a mentor or friend for accountability

## Credits

- **Book**: "Don't Waste Your Life" by John Piper
- **Webapp**: Created for personal study and spiritual growth
- **Design**: Modern, accessible, distraction-free interface

## License

This is a personal study tool. The book content is copyright © 2003 by Desiring God Foundation. Please support the author by purchasing the book.

---

**May this tool help you deeply engage with the life-changing message of living for God's glory and not wasting your precious life.**
