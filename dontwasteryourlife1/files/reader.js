// Reader page JavaScript - Improved content rendering
(function() {
    'use strict';

    // Storage keys
    const STORAGE_KEYS = {
        TEXT_SIZE: 'dwyl_text_size',
        ANSWERS: 'dwyl_answers'
    };

    // State
    let currentChapter = null;
    let speechSynthesis = window.speechSynthesis;
    let currentUtterance = null;
    let isSpeaking = false;
    let currentPageIndex = 0;

    // Initialize the reader
    function init() {
        const urlParams = new URLSearchParams(window.location.search);
        const chapterNumber = parseInt(urlParams.get('chapter')) || 0;

        if (!window.BOOK_DATA) {
            showError('Book data not loaded');
            return;
        }

        currentChapter = window.BOOK_DATA.chapters.find(ch => ch.number === chapterNumber);
        if (!currentChapter) {
            showError('Chapter not found');
            return;
        }

        loadChapter();
        setupEventListeners();
        loadTextSize();
        loadReflectionQuestions();
        updateProgress();
    }

    // Load and display chapter content
    function loadChapter() {
        // Update title
        const titleElement = document.getElementById('chapterTitle');
        if (titleElement) {
            const chapterLabel = currentChapter.number === 0 ? 'Preface' : `Chapter ${currentChapter.number}`;
            titleElement.textContent = `${chapterLabel}: ${currentChapter.title}`;
        }

        // Load content
        const contentElement = document.getElementById('chapterContent');
        if (!contentElement) return;

        // Parse and format content
        const formattedContent = formatChapterContent(currentChapter.content);
        contentElement.innerHTML = `
            <h1>${escapeHtml(currentChapter.title)}</h1>
            ${formattedContent}
        `;

        // Setup page marker clicks
        setupPageMarkerClicks();

        // Populate page jump dropdown
        populatePageJump();
    }

    // Improved content formatting that handles markdown-style headers
    function formatChapterContent(content) {
        // Split content into lines
        const lines = content.split('\n');
        let html = '';
        let inParagraph = false;
        let paragraphText = '';

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // Check for page markers
            const pageMatch = line.match(/\[PAGE (\d+)\]/g);
            if (pageMatch) {
                // Close any open paragraph
                if (inParagraph && paragraphText.trim()) {
                    html += `<p>${formatInlineMarkup(paragraphText.trim())}</p>\n`;
                    paragraphText = '';
                    inParagraph = false;
                }

                // Add page markers
                pageMatch.forEach(marker => {
                    const pageNum = marker.match(/\[PAGE (\d+)\]/)[1];
                    html += `<span class="page-marker" data-page="${pageNum}">Page ${pageNum}</span> `;
                });

                // Remove page markers from line
                line = line.replace(/\[PAGE \d+\]/g, '').trim();
                if (!line) continue;
            }

            // Check for markdown-style headers (## Header)
            if (line.startsWith('## ')) {
                // Close any open paragraph
                if (inParagraph && paragraphText.trim()) {
                    html += `<p>${formatInlineMarkup(paragraphText.trim())}</p>\n`;
                    paragraphText = '';
                    inParagraph = false;
                }

                const headerText = line.substring(3).trim();
                html += `<h2>${escapeHtml(headerText)}</h2>\n`;
                continue;
            }

            // Check for h3 headers (### Header)
            if (line.startsWith('### ')) {
                if (inParagraph && paragraphText.trim()) {
                    html += `<p>${formatInlineMarkup(paragraphText.trim())}</p>\n`;
                    paragraphText = '';
                    inParagraph = false;
                }

                const headerText = line.substring(4).trim();
                html += `<h3>${escapeHtml(headerText)}</h3>\n`;
                continue;
            }

            // Empty line - end paragraph
            if (!line.trim()) {
                if (inParagraph && paragraphText.trim()) {
                    html += `<p>${formatInlineMarkup(paragraphText.trim())}</p>\n`;
                    paragraphText = '';
                    inParagraph = false;
                }
                continue;
            }

            // Regular text - add to paragraph
            if (!inParagraph) {
                inParagraph = true;
                paragraphText = line;
            } else {
                paragraphText += ' ' + line;
            }
        }

        // Close any remaining paragraph
        if (inParagraph && paragraphText.trim()) {
            html += `<p>${formatInlineMarkup(paragraphText.trim())}</p>\n`;
        }

        return html;
    }

    // Format inline markup (bold, italic, etc.)
    function formatInlineMarkup(text) {
        // Escape HTML first
        text = escapeHtml(text);

        // Handle bold (**text** or __text__)
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');

        // Handle italic (*text* or _text_)
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        text = text.replace(/_(.*?)_/g, '<em>$1</em>');

        return text;
    }

    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Setup page marker clicks
    function setupPageMarkerClicks() {
        document.querySelectorAll('.page-marker').forEach(marker => {
            marker.addEventListener('click', () => {
                marker.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }

    // Populate page jump dropdown
    function populatePageJump() {
        const pageJump = document.getElementById('pageJump');
        if (!pageJump || !currentChapter.pageNumbers || !currentChapter.pageNumbers.length) return;

        pageJump.innerHTML = '<option value="">Select page...</option>';
        currentChapter.pageNumbers.forEach(pageNum => {
            const option = document.createElement('option');
            option.value = pageNum;
            option.textContent = `Page ${pageNum}`;
            pageJump.appendChild(option);
        });

        // Handle page jump selection
        pageJump.addEventListener('change', (e) => {
            const pageNum = e.target.value;
            if (pageNum) {
                jumpToPage(parseInt(pageNum));
            }
        });
    }

    // Jump to specific page
    function jumpToPage(pageNum) {
        const marker = document.querySelector(`[data-page="${pageNum}"]`);
        if (marker) {
            marker.scrollIntoView({ behavior: 'smooth', block: 'center' });
            marker.classList.add('highlight');
            setTimeout(() => marker.classList.remove('highlight'), 2000);
        }
    }

    // Toggle text size selector
    function toggleTextSizeSelector() {
        const selector = document.getElementById('textSizeSelector');
        if (selector) {
            selector.classList.toggle('hidden');
        }
    }

    // Set text size
    function setTextSize(size) {
        const contentElement = document.getElementById('chapterContent');
        if (!contentElement) return;

        // Remove all size classes
        contentElement.classList.remove('text-small', 'text-medium', 'text-large');
        contentElement.classList.add(`text-${size}`);

        // Update active button
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.size === size) {
                btn.classList.add('active');
            }
        });

        // Save preference
        try {
            localStorage.setItem(STORAGE_KEYS.TEXT_SIZE, size);
        } catch (e) {
            console.error('Error saving text size:', e);
        }
    }

    // Load text size preference
    function loadTextSize() {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.TEXT_SIZE);
            if (saved) {
                setTextSize(saved);
            }
        } catch (e) {
            console.error('Error loading text size:', e);
        }
    }

    // Toggle audio controls
    function toggleAudioControls() {
        const controls = document.getElementById('audioControls');
        if (controls) {
            controls.classList.toggle('hidden');
        }
    }

    // Toggle play/pause
    function togglePlayPause() {
        if (isSpeaking) {
            pauseSpeech();
        } else {
            startSpeech();
        }
    }

    // Start speech synthesis
    function startSpeech() {
        if (isSpeaking) return;

        const contentElement = document.getElementById('chapterContent');
        if (!contentElement) return;

        // Get text content without HTML
        const text = contentElement.innerText;

        // Stop any existing speech
        speechSynthesis.cancel();

        // Create new utterance
        currentUtterance = new SpeechSynthesisUtterance(text);

        // Get speed setting
        const speedControl = document.getElementById('speedControl');
        if (speedControl) {
            currentUtterance.rate = parseFloat(speedControl.value);
        }

        // Setup event handlers
        currentUtterance.onend = () => {
            isSpeaking = false;
            updatePlayButton();
        };

        currentUtterance.onerror = (e) => {
            console.error('Speech synthesis error:', e);
            isSpeaking = false;
            updatePlayButton();
        };

        // Start speaking
        speechSynthesis.speak(currentUtterance);
        isSpeaking = true;
        updatePlayButton();
    }

    // Pause speech
    function pauseSpeech() {
        if (isSpeaking) {
            speechSynthesis.cancel();
            isSpeaking = false;
            updatePlayButton();
        }
    }

    // Update play button state
    function updatePlayButton() {
        const playBtn = document.getElementById('playPauseBtn');
        if (!playBtn) return;

        if (isSpeaking) {
            playBtn.classList.add('playing');
            playBtn.innerHTML = '<span class="icon">⏸️</span><span class="text">Pause</span>';
        } else {
            playBtn.classList.remove('playing');
            playBtn.innerHTML = '<span class="icon">▶️</span><span class="text">Play</span>';
        }
    }

    // Load reflection questions
    function loadReflectionQuestions() {
        if (!currentChapter.reflectionQuestions || currentChapter.reflectionQuestions.length === 0) {
            return;
        }

        const section = document.getElementById('reflectionSection');
        if (!section) return;

        section.style.display = 'block';

        const container = document.getElementById('questionsContainer');
        if (!container) return;

        container.innerHTML = '';

        // Load saved answers
        const answers = getChapterAnswers();

        // Create question items
        currentChapter.reflectionQuestions.forEach((question, index) => {
            const item = document.createElement('div');
            item.className = 'question-item';

            const savedAnswer = answers[`q${index}`] || '';

            item.innerHTML = `
                <div class="question-number">Question ${index + 1}</div>
                <div class="question-text">${escapeHtml(question)}</div>
                <textarea 
                    class="answer-textarea ${savedAnswer.trim() ? 'has-content' : ''}" 
                    data-question="${index}"
                    placeholder="Write your thoughts here..."
                    rows="5"
                >${escapeHtml(savedAnswer)}</textarea>
                <div class="char-count">
                    <span class="count">${savedAnswer.length}</span> characters
                </div>
            `;

            container.appendChild(item);
        });

        // Setup answer saving
        setupAnswerSaving();
    }

    // Setup answer saving
    function setupAnswerSaving() {
        document.querySelectorAll('.answer-textarea').forEach(textarea => {
            // Update character count
            textarea.addEventListener('input', (e) => {
                const count = e.target.value.length;
                const countSpan = e.target.parentElement.querySelector('.count');
                if (countSpan) {
                    countSpan.textContent = count;
                }

                // Update has-content class
                if (count > 0) {
                    e.target.classList.add('has-content');
                } else {
                    e.target.classList.remove('has-content');
                }

                // Save answer
                saveAnswer(e.target.dataset.question, e.target.value);
            });
        });

        // Email answers button
        const emailBtn = document.getElementById('emailAnswers');
        if (emailBtn) {
            emailBtn.addEventListener('click', emailAnswers);
        }

        // Clear answers button
        const clearBtn = document.getElementById('clearAnswers');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearAnswers);
        }
    }

    // Get chapter answers
    function getChapterAnswers() {
        try {
            const allAnswers = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWERS) || '{}');
            return allAnswers[`chapter_${currentChapter.number}`] || {};
        } catch (e) {
            console.error('Error loading answers:', e);
            return {};
        }
    }

    // Save answer
    function saveAnswer(questionIndex, answer) {
        try {
            const allAnswers = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWERS) || '{}');
            const chapterKey = `chapter_${currentChapter.number}`;

            if (!allAnswers[chapterKey]) {
                allAnswers[chapterKey] = {};
            }

            allAnswers[chapterKey][`q${questionIndex}`] = answer;

            localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(allAnswers));
            updateProgress();
        } catch (e) {
            console.error('Error saving answer:', e);
        }
    }

    // Email answers
    function emailAnswers() {
        const answers = getChapterAnswers();
        const answeredCount = Object.values(answers).filter(a => a && a.trim()).length;

        if (answeredCount === 0) {
            alert('You haven\'t answered any questions yet.');
            return;
        }

        let emailBody = `Reflection Answers for ${currentChapter.title}\n\n`;

        currentChapter.reflectionQuestions.forEach((question, index) => {
            const answer = answers[`q${index}`] || '(Not answered)';
            emailBody += `Question ${index + 1}: ${question}\n\nAnswer: ${answer}\n\n---\n\n`;
        });

        const mailtoLink = `mailto:?subject=My Reflections: ${encodeURIComponent(currentChapter.title)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
    }

    // Clear answers
    function clearAnswers() {
        if (!confirm('Are you sure you want to clear all your answers for this chapter? This cannot be undone.')) {
            return;
        }

        try {
            const allAnswers = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWERS) || '{}');
            delete allAnswers[`chapter_${currentChapter.number}`];
            localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(allAnswers));

            // Reload questions
            loadReflectionQuestions();
            updateProgress();

            alert('All answers for this chapter have been cleared.');
        } catch (e) {
            console.error('Error clearing answers:', e);
        }
    }

    // Update progress indicator
    function updateProgress() {
        const progressText = document.getElementById('progressText');
        if (!progressText) return;

        const answers = getChapterAnswers();
        const total = currentChapter.reflectionQuestions.length;
        const answered = Object.values(answers).filter(a => a && a.trim()).length;

        progressText.textContent = `${answered} of ${total} questions answered`;
    }

    // Show error message
    function showError(message) {
        const contentElement = document.getElementById('chapterContent');
        if (contentElement) {
            contentElement.innerHTML = `
                <div class="error-message">
                    <h2>Error</h2>
                    <p>${escapeHtml(message)}</p>
                    <a href="index.html" class="btn-primary">Return to Chapters</a>
                </div>
            `;
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Text size button
        const textSizeBtn = document.getElementById('textSizeBtn');
        if (textSizeBtn) {
            textSizeBtn.addEventListener('click', toggleTextSizeSelector);
        }

        // Text size buttons
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const size = e.target.dataset.size;
                setTextSize(size);
            });
        });

        // Listen button
        const listenBtn = document.getElementById('listenBtn');
        if (listenBtn) {
            listenBtn.addEventListener('click', toggleAudioControls);
        }

        // Audio controls
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', togglePlayPause);
        }

        const stopBtn = document.getElementById('stopBtn');
        if (stopBtn) {
            stopBtn.addEventListener('click', pauseSpeech);
        }

        // Speed control
        const speedControl = document.getElementById('speedControl');
        if (speedControl) {
            speedControl.addEventListener('change', () => {
                if (isSpeaking) {
                    // Restart with new speed
                    pauseSpeech();
                    setTimeout(startSpeech, 100);
                }
            });
        }
    }

    // Start the reader when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
