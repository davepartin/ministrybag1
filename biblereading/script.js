// Bible Books Data
const BIBLE_BOOKS = {
    // Old Testament
    'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
    'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
    '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36,
    'Ezra': 10, 'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150,
    'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66,
    'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12,
    'Hosea': 14, 'Joel': 3, 'Amos': 9, 'Obadiah': 1, 'Jonah': 4,
    'Micah': 7, 'Nahum': 3, 'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2,
    'Zechariah': 14, 'Malachi': 4,
    // New Testament
    'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28,
    'Romans': 16, '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6,
    'Ephesians': 6, 'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5,
    '2 Thessalonians': 3, '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3,
    'Philemon': 1, 'Hebrews': 13, 'James': 5, '1 Peter': 5, '2 Peter': 3,
    '1 John': 5, '2 John': 1, '3 John': 1, 'Jude': 1, 'Revelation': 22
};

// Reading Plans
const READING_PLANS = {
    sequential: {
        name: 'Sequential',
        books: Object.keys(BIBLE_BOOKS)
    },
    newtestament: {
        name: 'New Testament',
        books: ['Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians',
                '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians',
                '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus',
                'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John',
                '3 John', 'Jude', 'Revelation']
    },
    gospels: {
        name: 'Gospels & Acts',
        books: ['Matthew', 'Mark', 'Luke', 'John', 'Acts']
    }
};

// App State
let currentPlan = null;
let currentBookIndex = 0;
let currentChapter = 1;
let currentBook = null;

// LocalStorage Keys
const STORAGE_KEYS = {
    READ_CHAPTERS: 'bibleReadChapters',
    NOTES: 'bibleNotes',
    CURRENT_PLAN: 'currentReadingPlan',
    CURRENT_BOOK: 'currentBook',
    CURRENT_CHAPTER: 'currentChapter'
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    attachEventListeners();
    updateStats();
});

function initializeApp() {
    // Load saved state
    const savedPlan = localStorage.getItem(STORAGE_KEYS.CURRENT_PLAN);
    const savedBook = localStorage.getItem(STORAGE_KEYS.CURRENT_BOOK);
    const savedChapter = localStorage.getItem(STORAGE_KEYS.CURRENT_CHAPTER);

    if (savedPlan && savedBook && savedChapter) {
        currentPlan = savedPlan;
        currentBook = savedBook;
        currentChapter = parseInt(savedChapter);

        if (currentPlan !== 'custom') {
            const planBooks = READING_PLANS[currentPlan].books;
            currentBookIndex = planBooks.indexOf(currentBook);
        }
    }

    // Populate book selector for custom plan
    populateBookSelector();
}

function attachEventListeners() {
    // Plan selection buttons
    document.querySelectorAll('.plan-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const plan = e.currentTarget.dataset.plan;
            selectPlan(plan);
        });
    });

    // Navigation buttons
    document.getElementById('backToMainBtn').addEventListener('click', showMainView);
    document.getElementById('backToMainFromNotesBtn').addEventListener('click', showMainView);
    document.getElementById('viewNotesBtn').addEventListener('click', showNotesView);
    document.getElementById('prevChapterBtn').addEventListener('click', loadPreviousChapter);
    document.getElementById('nextChapterBtn').addEventListener('click', loadNextChapter);

    // Custom plan controls
    document.getElementById('bookSelect').addEventListener('change', updateChapterSelector);
    document.getElementById('loadPassageBtn').addEventListener('click', loadCustomPassage);

    // Mark as read
    document.getElementById('markReadCheckbox').addEventListener('change', toggleReadStatus);

    // Notes
    document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);

    // Notes view controls
    document.getElementById('notesSearchInput').addEventListener('input', filterNotes);
    document.getElementById('exportNotesBtn').addEventListener('click', exportNotes);
}

// View Management
function showMainView() {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('mainView').classList.add('active');
    updateStats();
}

function showReadingView() {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('readingView').classList.add('active');
}

function showNotesView() {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('notesView').classList.add('active');
    renderNotesList();
}

// Plan Selection
function selectPlan(plan) {
    currentPlan = plan;

    if (plan === 'custom') {
        // Show custom selector
        document.getElementById('customSelector').style.display = 'flex';
        showReadingView();
        // Don't load passage yet, wait for user selection
    } else {
        // Hide custom selector
        document.getElementById('customSelector').style.display = 'none';

        // Start from first book, chapter 1
        currentBookIndex = 0;
        currentBook = READING_PLANS[plan].books[0];
        currentChapter = 1;

        saveState();
        showReadingView();
        loadCurrentPassage();
    }
}

// Bible API
async function loadPassage(book, chapter) {
    const bibleText = document.getElementById('bibleText');
    bibleText.innerHTML = '<p class="loading">Loading passage...</p>';

    try {
        const passage = `${book}+${chapter}`;
        const response = await fetch(`https://labs.bible.org/api/?passage=${encodeURIComponent(passage)}&type=json`);

        if (!response.ok) {
            throw new Error('Failed to load passage');
        }

        const verses = await response.json();
        displayPassage(verses);
        updateReadStatus();
        loadNotes();
        updateNavigationButtons();
        updatePageTitle();
    } catch (error) {
        console.error('Error loading passage:', error);
        bibleText.innerHTML = '<p class="error">Failed to load passage. Please try again.</p>';
    }
}

function displayPassage(verses) {
    const bibleText = document.getElementById('bibleText');

    if (!verses || verses.length === 0) {
        bibleText.innerHTML = '<p class="error">No text available for this passage.</p>';
        return;
    }

    let html = '';
    verses.forEach(verse => {
        html += `
            <p class="verse">
                <span class="verse-number">${verse.verse}</span>
                <span class="verse-text">${verse.text}</span>
            </p>
        `;
    });

    bibleText.innerHTML = html;
}

function updatePageTitle() {
    document.getElementById('passageTitle').textContent = `${currentBook} ${currentChapter}`;
}

// Navigation
function loadCurrentPassage() {
    loadPassage(currentBook, currentChapter);
}

function loadPreviousChapter() {
    if (currentPlan === 'custom') {
        // In custom mode, just go back one chapter in current book
        if (currentChapter > 1) {
            currentChapter--;
            saveState();
            loadCurrentPassage();
        }
    } else {
        // In plan mode, navigate through the plan
        if (currentChapter > 1) {
            currentChapter--;
        } else {
            // Go to previous book
            if (currentBookIndex > 0) {
                currentBookIndex--;
                currentBook = READING_PLANS[currentPlan].books[currentBookIndex];
                currentChapter = BIBLE_BOOKS[currentBook];
            }
        }
        saveState();
        loadCurrentPassage();
    }
}

function loadNextChapter() {
    if (currentPlan === 'custom') {
        // In custom mode, go forward one chapter in current book
        const maxChapter = BIBLE_BOOKS[currentBook];
        if (currentChapter < maxChapter) {
            currentChapter++;
            saveState();
            loadCurrentPassage();
        }
    } else {
        // In plan mode, navigate through the plan
        const maxChapter = BIBLE_BOOKS[currentBook];

        if (currentChapter < maxChapter) {
            currentChapter++;
        } else {
            // Go to next book
            const planBooks = READING_PLANS[currentPlan].books;
            if (currentBookIndex < planBooks.length - 1) {
                currentBookIndex++;
                currentBook = planBooks[currentBookIndex];
                currentChapter = 1;
            }
        }
        saveState();
        loadCurrentPassage();
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevChapterBtn');
    const nextBtn = document.getElementById('nextChapterBtn');

    if (currentPlan === 'custom') {
        prevBtn.disabled = currentChapter === 1;
        nextBtn.disabled = currentChapter === BIBLE_BOOKS[currentBook];
    } else {
        const planBooks = READING_PLANS[currentPlan].books;
        prevBtn.disabled = currentBookIndex === 0 && currentChapter === 1;
        nextBtn.disabled = currentBookIndex === planBooks.length - 1 &&
                          currentChapter === BIBLE_BOOKS[currentBook];
    }
}

// Custom Plan
function populateBookSelector() {
    const bookSelect = document.getElementById('bookSelect');
    bookSelect.innerHTML = '<option value="">Select a book...</option>';

    Object.keys(BIBLE_BOOKS).forEach(book => {
        const option = document.createElement('option');
        option.value = book;
        option.textContent = book;
        bookSelect.appendChild(option);
    });
}

function updateChapterSelector() {
    const bookSelect = document.getElementById('bookSelect');
    const chapterSelect = document.getElementById('chapterSelect');
    const selectedBook = bookSelect.value;

    chapterSelect.innerHTML = '';

    if (selectedBook) {
        const numChapters = BIBLE_BOOKS[selectedBook];
        for (let i = 1; i <= numChapters; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Chapter ${i}`;
            chapterSelect.appendChild(option);
        }
    }
}

function loadCustomPassage() {
    const bookSelect = document.getElementById('bookSelect');
    const chapterSelect = document.getElementById('chapterSelect');

    currentBook = bookSelect.value;
    currentChapter = parseInt(chapterSelect.value);

    if (currentBook && currentChapter) {
        saveState();
        loadCurrentPassage();
    }
}

// Mark as Read
function toggleReadStatus() {
    const isRead = document.getElementById('markReadCheckbox').checked;
    const key = `${currentBook}_${currentChapter}`;

    let readChapters = getReadChapters();

    if (isRead) {
        readChapters[key] = new Date().toISOString();
    } else {
        delete readChapters[key];
    }

    localStorage.setItem(STORAGE_KEYS.READ_CHAPTERS, JSON.stringify(readChapters));
    updateStats();
}

function updateReadStatus() {
    const key = `${currentBook}_${currentChapter}`;
    const readChapters = getReadChapters();
    const checkbox = document.getElementById('markReadCheckbox');
    checkbox.checked = readChapters.hasOwnProperty(key);
}

function getReadChapters() {
    const data = localStorage.getItem(STORAGE_KEYS.READ_CHAPTERS);
    return data ? JSON.parse(data) : {};
}

// Notes
function saveNotes() {
    const notesText = document.getElementById('notesTextarea').value.trim();
    const key = `${currentBook}_${currentChapter}`;

    let allNotes = getAllNotes();

    if (notesText) {
        allNotes[key] = {
            text: notesText,
            date: new Date().toISOString(),
            book: currentBook,
            chapter: currentChapter
        };
    } else {
        delete allNotes[key];
    }

    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(allNotes));
    updateStats();

    // Show feedback
    const btn = document.getElementById('saveNotesBtn');
    const originalText = btn.textContent;
    btn.textContent = 'Saved!';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}

function loadNotes() {
    const key = `${currentBook}_${currentChapter}`;
    const allNotes = getAllNotes();
    const textarea = document.getElementById('notesTextarea');

    if (allNotes[key]) {
        textarea.value = allNotes[key].text;
    } else {
        textarea.value = '';
    }
}

function getAllNotes() {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : {};
}

// Notes Summary View
function renderNotesList(filter = '') {
    const notesList = document.getElementById('notesList');
    const allNotes = getAllNotes();
    const notesArray = Object.entries(allNotes).map(([key, note]) => note);

    if (notesArray.length === 0) {
        notesList.innerHTML = '<p class="empty-state">No notes yet. Start reading and add your first note!</p>';
        return;
    }

    // Filter notes
    const filteredNotes = filter
        ? notesArray.filter(note =>
            note.text.toLowerCase().includes(filter.toLowerCase()) ||
            note.book.toLowerCase().includes(filter.toLowerCase())
          )
        : notesArray;

    // Sort by date (newest first)
    filteredNotes.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filteredNotes.length === 0) {
        notesList.innerHTML = '<p class="empty-state">No notes match your search.</p>';
        return;
    }

    // Render notes
    let html = '';
    filteredNotes.forEach(note => {
        const date = new Date(note.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        html += `
            <div class="note-item">
                <h4>${note.book} ${note.chapter}</h4>
                <div class="note-date">${date}</div>
                <div class="note-text">${escapeHtml(note.text)}</div>
            </div>
        `;
    });

    notesList.innerHTML = html;
}

function filterNotes() {
    const searchInput = document.getElementById('notesSearchInput');
    renderNotesList(searchInput.value);
}

function exportNotes() {
    const allNotes = getAllNotes();
    const notesArray = Object.entries(allNotes).map(([key, note]) => note);

    if (notesArray.length === 0) {
        alert('No notes to export!');
        return;
    }

    // Sort by book order
    notesArray.sort((a, b) => {
        const bookOrder = Object.keys(BIBLE_BOOKS);
        const bookDiff = bookOrder.indexOf(a.book) - bookOrder.indexOf(b.book);
        if (bookDiff !== 0) return bookDiff;
        return a.chapter - b.chapter;
    });

    // Create text content
    let content = 'MY BIBLE READING NOTES\n';
    content += '='.repeat(50) + '\n\n';

    notesArray.forEach(note => {
        const date = new Date(note.date).toLocaleDateString();
        content += `${note.book} ${note.chapter}\n`;
        content += `Date: ${date}\n`;
        content += '-'.repeat(50) + '\n';
        content += note.text + '\n\n';
        content += '='.repeat(50) + '\n\n';
    });

    // Create download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bible-notes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Stats
function updateStats() {
    const readChapters = getReadChapters();
    const allNotes = getAllNotes();

    document.getElementById('chaptersRead').textContent = Object.keys(readChapters).length;
    document.getElementById('notesCount').textContent = Object.keys(allNotes).length;
}

// State Management
function saveState() {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLAN, currentPlan);
    localStorage.setItem(STORAGE_KEYS.CURRENT_BOOK, currentBook);
    localStorage.setItem(STORAGE_KEYS.CURRENT_CHAPTER, currentChapter.toString());
}

// Utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
