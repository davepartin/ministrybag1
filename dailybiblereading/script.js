// --- READING PLAN GENERATION ---
// Simple algo: 
// OT: 929 chapters / 365 days = ~2.54/day (Alternate 2,3)
// NT: 260 chapters / 365 days = ~0.71/day (Read 1/day, finish early? Or loop?)
// User req: "Old testament and New Testament... Each day you will read a little of each."
// Assuming standard 1-year plan.
// I will reuse `reading-plan.js` logic but inline it to be self-contained and accurate for Day 1..365

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 29 for Feb (static to 366 for safety)

const BIBLE_BOOKS = {
    ot: [
        { name: "Genesis", ch: 50 }, { name: "Exodus", ch: 40 }, { name: "Leviticus", ch: 27 },
        { name: "Numbers", ch: 36 }, { name: "Deuteronomy", ch: 34 }, { name: "Joshua", ch: 24 },
        { name: "Judges", ch: 21 }, { name: "Ruth", ch: 4 }, { name: "1 Samuel", ch: 31 },
        { name: "2 Samuel", ch: 24 }, { name: "1 Kings", ch: 22 }, { name: "2 Kings", ch: 25 },
        { name: "1 Chronicles", ch: 29 }, { name: "2 Chronicles", ch: 36 }, { name: "Ezra", ch: 10 },
        { name: "Nehemiah", ch: 13 }, { name: "Esther", ch: 10 }, { name: "Job", ch: 42 },
        { name: "Psalms", ch: 150 }, { name: "Proverbs", ch: 31 }, { name: "Ecclesiastes", ch: 12 },
        { name: "Song of Solomon", ch: 8 }, { name: "Isaiah", ch: 66 }, { name: "Jeremiah", ch: 52 },
        { name: "Lamentations", ch: 5 }, { name: "Ezekiel", ch: 48 }, { name: "Daniel", ch: 12 },
        { name: "Hosea", ch: 14 }, { name: "Joel", ch: 3 }, { name: "Amos", ch: 9 },
        { name: "Obadiah", ch: 1 }, { name: "Jonah", ch: 4 }, { name: "Micah", ch: 7 },
        { name: "Nahum", ch: 3 }, { name: "Habakkuk", ch: 3 }, { name: "Zephaniah", ch: 3 },
        { name: "Haggai", ch: 2 }, { name: "Zechariah", ch: 14 }, { name: "Malachi", ch: 4 }
    ],
    nt: [
        { name: "Matthew", ch: 28 }, { name: "Mark", ch: 16 }, { name: "Luke", ch: 24 }, { name: "John", ch: 21 },
        { name: "Acts", ch: 28 }, { name: "Romans", ch: 16 }, { name: "1 Corinthians", ch: 16 },
        { name: "2 Corinthians", ch: 13 }, { name: "Galatians", ch: 6 }, { name: "Ephesians", ch: 6 },
        { name: "Philippians", ch: 4 }, { name: "Colossians", ch: 4 }, { name: "1 Thessalonians", ch: 5 },
        { name: "2 Thessalonians", ch: 3 }, { name: "1 Timothy", ch: 6 }, { name: "2 Timothy", ch: 4 },
        { name: "Titus", ch: 3 }, { name: "Philemon", ch: 1 }, { name: "Hebrews", ch: 13 },
        { name: "James", ch: 5 }, { name: "1 Peter", ch: 5 }, { name: "2 Peter", ch: 3 },
        { name: "1 John", ch: 5 }, { name: "2 John", ch: 1 }, { name: "3 John", ch: 1 },
        { name: "Jude", ch: 1 }, { name: "Revelation", ch: 22 }
    ]
};

// Global Reading Plan Map: Day(1-366) -> { ot: "Gen 1-2", nt: "Matt 1" }
const DAILY_READINGS = generateYearPlan();

function generateYearPlan() {
    const plan = [];
    let otCursor = { bookIdx: 0, chapter: 1 };
    let ntCursor = { bookIdx: 0, chapter: 1 };

    for (let i = 0; i < 366; i++) {
        // OT: ~2.5 chapters/day
        let otCount = (i % 2 === 0) ? 3 : 2;
        if (i % 7 === 0) otCount = 3; // Slight adjustment to ensure completion

        // NT: ~0.7 chapters/day? Using 1/day finishes early (Day 260).
        // Let's read 1 NT chapter per day, and loop? Or map Psalms/Proverbs separate?
        // User requested "Old Testament AND New Testament".
        // To fill year, we can slow down NT or augment with Psalms.
        // Let's stick to 1 NT chapter/day. If we finish, we restart (or just Psalms).
        // Let's loop NT.

        const otRef = getNextReading(BIBLE_BOOKS.ot, otCursor, otCount);
        const ntRef = getNextReading(BIBLE_BOOKS.nt, ntCursor, 1, true); // Loop NT

        plan.push({ ot: otRef, nt: ntRef });
    }
    return plan;
}

function getNextReading(books, cursor, count, loop = false) {
    let reading = "";
    let parts = [];
    let chaptersRead = 0;

    while (chaptersRead < count) {
        if (cursor.bookIdx >= books.length) {
            if (loop) cursor.bookIdx = 0;
            else break;
        }

        const book = books[cursor.bookIdx];
        const remainingInBook = book.ch - cursor.chapter + 1;
        const needed = count - chaptersRead;

        let endChapter = cursor.chapter + needed - 1;

        if (needed >= remainingInBook) {
            endChapter = book.ch;
        }

        if (endChapter === cursor.chapter) {
            parts.push(`${book.name} ${cursor.chapter}`);
        } else {
            parts.push(`${book.name} ${cursor.chapter}-${endChapter}`);
        }

        const justRead = endChapter - cursor.chapter + 1;
        chaptersRead += justRead;
        cursor.chapter = endChapter + 1;

        if (cursor.chapter > book.ch) {
            cursor.bookIdx++;
            cursor.chapter = 1;
        }
    }
    return parts.join("; ");
}

// --- APP STATE & INIT ---

const STATE = {
    currentMonth: 0,
    currentDay: 1, // 1-31
    dayOfYear: 0 // 0-365
};

document.addEventListener('DOMContentLoaded', () => {
    initCalendar();
    loadProgress();

    // Listeners
    document.getElementById('backToCalendarBtn').addEventListener('click', showHome);
    document.getElementById('backToCalendarBtnBottom').addEventListener('click', showHome);
    document.getElementById('backToHomeFromNotesBtn').addEventListener('click', showHome);
    document.getElementById('markDayComplete').addEventListener('change', toggleDayComplete);
    document.getElementById('markDayCompleteTop').addEventListener('change', toggleDayComplete);
    document.getElementById('saveNotesBtn').addEventListener('click', saveDailyNote);

    document.getElementById('prevDayBtn').addEventListener('click', () => changeDay(-1));
    document.getElementById('nextDayBtn').addEventListener('click', () => changeDay(1));

    document.getElementById('viewAllNotesBtn').addEventListener('click', showAllNotes);
    document.getElementById('emailNotesBtn').addEventListener('click', emailAllNotes);

    // Text Size Listeners
    document.querySelectorAll('.text-size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const size = e.target.closest('button').dataset.size;
            setTextSize(size);
        });
    });

    initTextSize();

    // Audio Listeners
    document.getElementById('listenBtn').addEventListener('click', toggleAudio);
    document.getElementById('stopBtn').addEventListener('click', stopAudio);

    // Pre-load voices - crucial for iOS which loads async
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };
        }
    }
});

// --- CALENDAR UI ---

function initCalendar() {
    const grid = document.getElementById('yearGrid');
    grid.innerHTML = '';

    let globalDayCount = 0;

    MONTHS.forEach((monthName, mIdx) => {
        const card = document.createElement('div');
        card.className = 'month-card';

        const title = document.createElement('div');
        title.className = 'month-title';
        title.textContent = monthName;
        card.appendChild(title);

        const daysContainer = document.createElement('div');
        daysContainer.className = 'days-grid';

        const days = DAYS_IN_MONTH[mIdx];

        for (let d = 1; d <= days; d++) {
            const dayOfYear = globalDayCount; // 0-indexed
            const bubble = document.createElement('div');
            bubble.className = 'day-bubble';
            bubble.textContent = d;
            bubble.id = `day-${dayOfYear}`;
            bubble.onclick = () => openDay(mIdx, d, dayOfYear);

            daysContainer.appendChild(bubble);
            globalDayCount++;
        }

        card.appendChild(daysContainer);
        grid.appendChild(card);
    });
}

function updateCalendarState() {
    const completed = JSON.parse(localStorage.getItem('dbr_completed_days') || '[]');

    // Clear all
    document.querySelectorAll('.day-bubble').forEach(b => b.classList.remove('completed'));

    // Fill completed
    completed.forEach(dayIndex => {
        const bubble = document.getElementById(`day-${dayIndex}`);
        if (bubble) bubble.classList.add('completed');
    });

    // Stats
    const count = completed.length;
    document.getElementById('daysCompleted').textContent = count;
    const pct = (count / 366) * 100;
    document.getElementById('overallProgress').style.width = pct + '%';
}

function loadProgress() {
    updateCalendarState();
}

// --- READING VIEW & NOTES VIEW ---

function openDay(monthIdx, day, dayOfYear) {
    STATE.currentMonth = monthIdx;
    STATE.currentDay = day;
    STATE.dayOfYear = dayOfYear;

    // View Switch
    hideAllViews();
    stopAudio(); // Stop audio when switching pages
    document.getElementById('readingView').classList.add('active');
    window.scrollTo(0, 0);

    loadReadingContent();
}

function showHome() {
    hideAllViews();
    stopAudio();
    document.getElementById('homeView').classList.add('active');
    updateCalendarState(); // Refresh in case we marked complete
}

function showAllNotes() {
    hideAllViews();
    document.getElementById('allNotesView').classList.add('active');
    window.scrollTo(0, 0);
    renderAllNotes();
}

function hideAllViews() {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
}

function changeDay(delta) {
    let newDayOfYear = STATE.dayOfYear + delta;
    if (newDayOfYear < 0) newDayOfYear = 0;
    if (newDayOfYear > 365) newDayOfYear = 365;

    // Reverse lookup Month/Day from DayOfYear?
    // Use logic: iterate counts
    let count = 0;
    let foundM = 0;
    let foundD = 1;

    for (let m = 0; m < 12; m++) {
        if (newDayOfYear < count + DAYS_IN_MONTH[m]) {
            foundM = m;
            foundD = newDayOfYear - count + 1;
            break;
        }
        count += DAYS_IN_MONTH[m];
    }

    openDay(foundM, foundD, newDayOfYear);
}

// --- LOGIC & FETCH ---

async function loadReadingContent() {
    const readings = DAILY_READINGS[STATE.dayOfYear];
    const monthName = MONTHS[STATE.currentMonth];

    document.getElementById('dayTitle').textContent = `${monthName} ${STATE.currentDay}`;

    document.getElementById('otReference').textContent = readings.ot;
    document.getElementById('otText').innerHTML = 'Loading...';

    document.getElementById('ntReference').textContent = readings.nt;
    document.getElementById('ntText').innerHTML = 'Loading...';

    // Apply current text size to newly loaded content containers (just in case)
    const savedSize = localStorage.getItem('dbr_text_size') || 'md';
    setTextSize(savedSize);

    // Checkbox State
    const completed = JSON.parse(localStorage.getItem('dbr_completed_days') || '[]');
    const isCompleted = completed.includes(STATE.dayOfYear);
    document.getElementById('markDayComplete').checked = isCompleted;
    document.getElementById('markDayCompleteTop').checked = isCompleted;

    // Notes State
    const notes = JSON.parse(localStorage.getItem('dbr_notes_daily') || '{}');
    const noteData = notes[STATE.dayOfYear];

    // Handle migration: if string, show it. If object, show .text
    if (typeof noteData === 'object' && noteData !== null) {
        document.getElementById('dailyNotes').value = noteData.text || '';
    } else {
        document.getElementById('dailyNotes').value = noteData || '';
    }

    // Fetch
    fetchText('ot', readings.ot);
    fetchText('nt', readings.nt);
}

async function fetchText(section, ref) {
    // NET API
    // Handle split references "Gen 1-2; Ps 5"
    // The Labs API supports semicolons? Or need to loop?
    // Let's try raw. If fails, we might need to split.
    // NET Labs API generally handles single ranges well. "Gen 1-2".
    // Does it handle "Gen 50; Ex 1"?
    // If ref contains ";", split and fetch separately, then join.

    const container = document.getElementById(section + 'Text');

    try {
        if (ref.includes(';')) {
            const parts = ref.split(';');
            let fullHtml = "";
            for (let part of parts) {
                fullHtml += await fetchOneRef(part.trim());
            }
            container.innerHTML = fullHtml;
        } else {
            container.innerHTML = await fetchOneRef(ref);
        }
    } catch (e) {
        container.innerHTML = "Error loading text.";
        console.error(e);
    }
}

async function fetchOneRef(reference) {
    // formatting=para returns HTML paragraphs. 
    // We remove type=json so it defaults to HTML (or we could explicitly add type=html, but default is fine).
    const url = `https://labs.bible.org/api/?passage=${encodeURIComponent(reference)}&formatting=para`;
    const res = await fetch(url);
    const html = await res.text();

    if (!html) return "";

    return processHtml(html, reference);
}

function processHtml(html, reference) {
    // 1. Detect Book Name (e.g. "Genesis 1" -> "Genesis", "1 Kings 12" -> "1 Kings")
    // Simple heuristic: everything before the last number? 
    // Actually, reference might be "Genesis 1" or "Genesis 1-2".
    // Let's just grab the book name from the reference string roughly.
    // Or we can rely on the fact that the API text doesn't explicitly give us the Book Name in the HTML body easily 
    // except for maybe checking the class... but the class is just bodytext.

    // Let's try to extract Book Name from the `reference` argument passed in.
    // "1 Kings 5" -> "1 Kings"
    // "Genesis 1" -> "Genesis"
    const bookMatch = reference.match(/^((?:\d\s)?[A-Za-z\s]+)/);
    const bookName = bookMatch ? bookMatch[1].trim() : "";

    // 2. Parse HTML to inject Chapter Headings
    // The API returns: <p class="bodytext"><b>1:1</b> Verse text...</p>
    // Or just <b>1</b> if it continues.
    // Chapter transitions look like: ... end of ch 1 </p> <p class="bodytext"><b>2:1</b> ...
    // So we look for <b>(\d+):1</b> pattern inside the HTML string.

    // We want to insert `<h5>BookName ChapterNum</h5>` BEFORE the paragraph that starts the new chapter.
    // Since it's a string, we can regex replace.

    // Regex to find Chapter:1 pattern literally in the <b> tag.
    // The pattern is usually `<b>{chapter}:1</b>`. 
    // Example: <b>2:1</b>

    // We need to be careful. Is it always at the START of a p tag? Usually yes for a new chapter.
    // replace: (<p [^>]*>\s*<b>(\d+):1<\/b>)
    // with: <h5>BookName $2</h5> $1

    // Also handle the VERY FIRST chapter if it's 1:1, it might just be <b>1:1</b>.
    // But we might want a header for the very first chapter regardless.

    // Let's try a regex replacer.
    let processedHtml = html;

    // Pattern 1: Chapter Headings
    // <p ...><b>Ch:1</b>
    // We catch the whole opening tag sequence to put the header before it.
    // Note: older API responses might vary slightly in spacing. 
    // `<b>12:1</b>`
    const chapterRegex = /(<p[^>]*>\s*<b>(\d+):1<\/b>)/gi;

    processedHtml = processedHtml.replace(chapterRegex, (match, p1, chapterNum) => {
        return `<h5>${bookName} ${chapterNum}</h5>${p1}`;
    });

    // Pattern 2: Verse Numbers
    // The API wraps verse numbers in <b> tags. e.g. <b>1:1</b> or <b>2</b>
    // But it also wraps OT quotes in <b> tags e.g. <b>Look!</b>.
    // We only want to style the numbers as superscripts.
    // Regex: <b> followed by digits, optional colon+digits, then </b>
    const verseNumRegex = /<b>(\d+(?::\d+)?)<\/b>/gi;

    processedHtml = processedHtml.replace(verseNumRegex, (match, number) => {
        return `<b class="verse-num">${number}</b>`;
    });

    // Check if the very first verse is 1:1 of a chapter but NOT caught by the above 
    // (e.g. if the user asked for "Gen 1" and the API just returned it starting with <p...<b>1:1</b>)
    // The regex above should catch it acting on the string.

    // What if the reading doesn't start at verse 1?
    // "Genesis 1:5-10". It will just show text. That is fine.
    // "Genesis 1:1". It will start with <b>1:1</b>. The regex detects it and adds "Genesis 1".

    // One edge case: The API might return multiple books? e.g. "Gen 50; Ex 1"
    // Our fetchText function handles splitting by semicolon, so `fetchOneRef` only ever sees one continuous block (usually one book).
    // So `bookName` variable is reliable for that block.

    return processedHtml;
}

function renderAllNotes() {
    const container = document.getElementById('notesListContainer');
    const notes = JSON.parse(localStorage.getItem('dbr_notes_daily') || '{}');

    const keys = Object.keys(notes).map(k => parseInt(k)); // Day Indices

    if (keys.length === 0) {
        container.innerHTML = '<p class="empty-notes">You haven\'t written any notes yet.</p>';
        return;
    }

    container.innerHTML = '';

    // We want to sort. If we have timestamps, sort by that. If not, sort by plan day?
    // User asked for "date it was written".
    // Let's create an array of objects to sort.

    const noteList = keys.map(dayIdx => {
        const raw = notes[dayIdx];
        let text = "";
        let date = null;

        if (typeof raw === 'object' && raw !== null) {
            text = raw.text;
            date = raw.updated ? new Date(raw.updated) : null;
        } else {
            text = raw; // Legacy string
        }

        // Resolve Readings
        const readings = DAILY_READINGS[dayIdx];

        return {
            dayIdx: dayIdx,
            text: text,
            date: date,
            readings: readings
        };
    });

    // Sort: Newest timestamp first. Fallback to Day Index (descending) if no timestamp.
    noteList.sort((a, b) => {
        if (a.date && b.date) return b.date - a.date;
        if (a.date) return -1;
        if (b.date) return 1;
        return b.dayIdx - a.dayIdx;
    });

    noteList.forEach(item => {
        const card = document.createElement('div');
        card.className = 'note-card';

        // Passages
        const title = `${item.readings.ot} / ${item.readings.nt}`;

        // Calculate Month/Day from dayIdx (0-365)
        let tempCount = 0;
        let mName = "";
        let dNum = 0;

        for (let m = 0; m < 12; m++) {
            if (item.dayIdx < tempCount + DAYS_IN_MONTH[m]) {
                mName = MONTHS[m];
                dNum = item.dayIdx - tempCount + 1;
                break;
            }
            tempCount += DAYS_IN_MONTH[m];
        }

        const readingDateStr = `${mName} ${dNum}`;

        card.innerHTML = `
            <div class="note-card-header">
                <div class="note-card-title">${readingDateStr} - ${title}</div>
            </div>
            <div class="note-card-body">${item.text}</div>
        `;

        // Optional: Make card clickable to jump to reading?
        container.appendChild(card);
    });
}

function emailAllNotes() {
    const notes = JSON.parse(localStorage.getItem('dbr_notes_daily') || '{}');
    const keys = Object.keys(notes).map(k => parseInt(k));

    if (keys.length === 0) {
        alert("No notes to email.");
        return;
    }

    const noteList = keys.map(dayIdx => {
        const raw = notes[dayIdx];
        let text = "";
        if (typeof raw === 'object' && raw !== null) {
            text = raw.text;
        } else {
            text = raw;
        }
        const readings = DAILY_READINGS[dayIdx];
        return { dayIdx, text, readings };
    });

    noteList.sort((a, b) => a.dayIdx - b.dayIdx);

    let body = "Daily Bible Reading - My Notes\n\n";

    noteList.forEach(item => {
        // Calculate Month/Day
        let tempCount = 0;
        let mName = "";
        let dNum = 0;
        for (let m = 0; m < 12; m++) {
            if (item.dayIdx < tempCount + DAYS_IN_MONTH[m]) {
                mName = MONTHS[m];
                dNum = item.dayIdx - tempCount + 1;
                break;
            }
            tempCount += DAYS_IN_MONTH[m];
        }

        const dateStr = `${mName} ${dNum}`;
        const title = `${item.readings.ot} / ${item.readings.nt}`;

        body += `--- ${dateStr} --- ${title} ---\n`;
        body += `${item.text}\n\n`;
    });

    const subject = encodeURIComponent("My Daily Bible Reading Notes");
    const mailBody = encodeURIComponent(body);

    window.location.href = `mailto:?subject=${subject}&body=${mailBody}`;
}

// --- PERSISTENCE ---

function toggleDayComplete(e) {
    const isComplete = e.target.checked;

    // Sync both checkboxes
    document.getElementById('markDayComplete').checked = isComplete;
    document.getElementById('markDayCompleteTop').checked = isComplete;

    let completed = JSON.parse(localStorage.getItem('dbr_completed_days') || '[]');

    if (isComplete) {
        if (!completed.includes(STATE.dayOfYear)) completed.push(STATE.dayOfYear);
    } else {
        completed = completed.filter(d => d !== STATE.dayOfYear);
    }

    localStorage.setItem('dbr_completed_days', JSON.stringify(completed));
}

function saveDailyNote() {
    const text = document.getElementById('dailyNotes').value;
    let notes = JSON.parse(localStorage.getItem('dbr_notes_daily') || '{}');

    if (text.trim()) {
        notes[STATE.dayOfYear] = {
            text: text,
            updated: Date.now()
        };
    } else {
        delete notes[STATE.dayOfYear];
    }

    localStorage.setItem('dbr_notes_daily', JSON.stringify(notes));
    alert("Note saved");
}

// --- TEXT SIZE ---

function initTextSize() {
    const savedSize = localStorage.getItem('dbr_text_size') || 'md';
    setTextSize(savedSize);
}

function setTextSize(size) {
    if (!['sm', 'md', 'lg'].includes(size)) return;

    // Save
    localStorage.setItem('dbr_text_size', size);

    // active class on buttons
    document.querySelectorAll('.text-size-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.size === size) btn.classList.add('active');
    });

    // Apply to text containers
    const containers = [
        document.getElementById('otText'),
        document.getElementById('ntText')
    ];

    containers.forEach(el => {
        if (!el) return;
        el.classList.remove('text-sm', 'text-md', 'text-lg');
        el.classList.add(`text-${size}`);
    });
}

// --- TEXT TO SPEECH ---

let currentUtterance = null;
let isSpeaking = false;
let isPaused = false;

function toggleAudio() {
    if (isSpeaking) {
        if (isPaused) {
            // Resume
            window.speechSynthesis.resume();
            isPaused = false;
            updateAudioUI('playing');
        } else {
            // Pause
            window.speechSynthesis.pause();
            isPaused = true;
            updateAudioUI('paused');
        }
        return;
    }

    // Start fresh
    playReading();
}

function stopAudio() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    isSpeaking = false;
    isPaused = false;
    updateAudioUI('idle');
}

function updateAudioUI(state) {
    // state: 'idle', 'playing', 'paused'
    const listenBtn = document.getElementById('listenBtn');
    const stopBtn = document.getElementById('stopBtn');
    const listenSpan = listenBtn.querySelector('span');

    if (state === 'idle') {
        listenBtn.style.display = 'inline-flex';
        listenSpan.textContent = '▶ Listen';
        stopBtn.style.display = 'none';
        listenBtn.classList.remove('active-audio-btn'); // Optional styling
    } else if (state === 'playing') {
        listenBtn.style.display = 'inline-flex';
        listenSpan.textContent = '⏸ Pause';
        stopBtn.style.display = 'inline-block';
    } else if (state === 'paused') {
        listenBtn.style.display = 'inline-flex';
        listenSpan.textContent = '▶ Resume';
        stopBtn.style.display = 'inline-block';
    }
}

function playReading() {
    if (!window.speechSynthesis) {
        alert("Text-to-speech is not supported in this browser.");
        return;
    }

    // Cancel any current speaking just in case
    window.speechSynthesis.cancel();

    const otText = document.getElementById('otText').innerText;
    const ntText = document.getElementById('ntText').innerText;
    const title = document.getElementById('dayTitle').textContent;
    const otRef = document.getElementById('otReference').textContent;
    const ntRef = document.getElementById('ntReference').textContent;

    // Construct text to read
    let fullText = `${title}. Old Testament Reading: ${otRef}. ${otText}. New Testament Reading: ${ntRef}. ${ntText}`;

    const utter = new SpeechSynthesisUtterance(fullText);

    // Select Voice
    const voice = getBestVoice();
    if (voice) utter.voice = voice;

    // Events
    utter.onstart = () => {
        isSpeaking = true;
        isPaused = false;
        updateAudioUI('playing');
    };
    utter.onend = () => {
        isSpeaking = false;
        isPaused = false;
        updateAudioUI('idle');
    };
    utter.onerror = (e) => {
        console.error("Speech error", e);
        isSpeaking = false;
        isPaused = false;
        updateAudioUI('idle');
    };

    window.speechSynthesis.speak(utter);
}



function getBestVoice() {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    // Priority 1: Specific high-quality iOS/Mac voices + Premium/Enhanced tags
    // iOS/macOS often has 'Siri', 'Samantha', 'Daniel'.
    // 'Premium' or 'Enhanced' usually indicates better quality.
    const preferred = [
        "Siri", "Ava", "Samantha", "Daniel", "Karen", "Moira", "Rishi", "Tessa", // Apple
        "Google US English", // Android/Chrome
        "Microsoft Zira", "Microsoft David", // Windows
        "Premium", "Enhanced" // Generic quality indicators
    ];

    for (let name of preferred) {
        // Case insensitive match
        const found = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
        if (found) return found;
    }

    // Priority 2: English (US first)
    const enUS = voices.find(v => v.lang === 'en-US');
    if (enUS) return enUS;

    const en = voices.find(v => v.lang.startsWith('en')); // Any English
    return en || voices[0];
}
