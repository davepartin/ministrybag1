// Reader page JavaScript with all features
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
    }

    // Load and display chapter content
    function loadChapter() {
        // Update title
        const titleElement = document.getElementById('chapterTitle');
        if (titleElement) {
            const chapterLabel = currentChapter.number === 0 ? 'Introduction' : `Chapter ${currentChapter.number}`;
            titleElement.textContent = `${chapterLabel}: ${currentChapter.title}`;
        }

        // Load content
        const contentElement = document.getElementById('chapterContent');
        if (!contentElement) return;

        // Parse and format content
        const formattedContent = formatChapterContent(currentChapter.content);
        contentElement.innerHTML = `
            <h1>${currentChapter.title}</h1>
            ${formattedContent}
        `;

        // Populate page jump dropdown
        populatePageJump();
    }

    // Format chapter content with page markers and paragraphs
    function formatChapterContent(content) {
        // Split by page markers
        const parts = content.split(/\[PAGE (\d+)\]/);
        let html = '';
        let currentPageNum = null;

        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                // This is text content
                const text = parts[i].trim();
                if (text) {
                    // Split into paragraphs
                    const paragraphs = text.split(/\n\n+/);
                    paragraphs.forEach(para => {
                        const trimmed = para.trim();
                        if (trimmed) {
                            // Check if it's a heading (short line, no punctuation at end)
                            if (trimmed.length < 100 && !trimmed.match(/[.!?]$/)) {
                                html += `<h2>${escapeHtml(trimmed)}</h2>\n`;
                            } else {
                                html += `<p>${escapeHtml(trimmed).replace(/\n/g, ' ')}</p>\n`;
                            }
                        }
                    });
                }
            } else {
                // This is a page number
                currentPageNum = parts[i];
                html += `<span class="page-marker" data-page="${currentPageNum}">Page ${currentPageNum}</span> `;
            }
        }

        return html;
    }

    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Populate page jump dropdown
    function populatePageJump() {
        const pageJump = document.getElementById('pageJump');
        if (!pageJump || !currentChapter.pageNumbers.length) return;

        pageJump.innerHTML = '<option value="">Select page...</option>';
        currentChapter.pageNumbers.forEach(pageNum => {
            const option = document.createElement('option');
            option.value = pageNum;
            option.textContent = `Page ${pageNum}`;
            pageJump.appendChild(option);
        });
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
            stopBtn.addEventListener('click', stopSpeech);
        }

        const speedControl = document.getElementById('speedControl');
        if (speedControl) {
            speedControl.addEventListener('change', updateSpeechRate);
        }

        const pageJump = document.getElementById('pageJump');
        if (pageJump) {
            pageJump.addEventListener('change', handlePageJump);
        }

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

        // Close selectors when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#textSizeBtn') && !e.target.closest('.text-size-selector')) {
                document.getElementById('textSizeSelector')?.classList.add('hidden');
            }
        });
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

        contentElement.className = 'chapter-content';
        contentElement.classList.add(`text-${size}`);

        // Update active button
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.size === size) {
                btn.classList.add('active');
            }
        });

        // Save preference
        localStorage.setItem(STORAGE_KEYS.TEXT_SIZE, size);
    }

    // Load text size preference
    function loadTextSize() {
        const saved = localStorage.getItem(STORAGE_KEYS.TEXT_SIZE) || 'medium';
        setTextSize(saved);
    }

    // Toggle audio controls
    function toggleAudioControls() {
        const audioControls = document.getElementById('audioControls');
        if (audioControls) {
            audioControls.classList.toggle('hidden');
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

    // Start text-to-speech
    function startSpeech() {
        const contentElement = document.getElementById('chapterContent');
        if (!contentElement) return;

        // Get text content
        const text = contentElement.innerText;

        if (currentUtterance && speechSynthesis.paused) {
            // Resume if paused
            speechSynthesis.resume();
        } else {
            // Create new utterance
            currentUtterance = new SpeechSynthesisUtterance(text);

            // Set voice (prefer English voices)
            const voices = speechSynthesis.getVoices();
            const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
            if (englishVoice) {
                currentUtterance.voice = englishVoice;
            }

            // Set rate from control
            const speedControl = document.getElementById('speedControl');
            if (speedControl) {
                currentUtterance.rate = parseFloat(speedControl.value);
            }

            // Event handlers
            currentUtterance.onend = () => {
                isSpeaking = false;
                updatePlayPauseButton();
            };

            currentUtterance.onerror = (e) => {
                console.error('Speech synthesis error:', e);
                isSpeaking = false;
                updatePlayPauseButton();
            };

            speechSynthesis.speak(currentUtterance);
        }

        isSpeaking = true;
        updatePlayPauseButton();
    }

    // Pause speech
    function pauseSpeech() {
        if (speechSynthesis.speaking) {
            speechSynthesis.pause();
            isSpeaking = false;
            updatePlayPauseButton();
        }
    }

    // Stop speech
    function stopSpeech() {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            currentUtterance = null;
            isSpeaking = false;
            updatePlayPauseButton();
        }
    }

    // Update play/pause button
    function updatePlayPauseButton() {
        const btn = document.getElementById('playPauseBtn');
        if (!btn) return;

        const icon = btn.querySelector('.icon');
        const text = btn.querySelector('.text');

        if (isSpeaking) {
            icon.textContent = '⏸️';
            text.textContent = 'Pause';
            btn.classList.add('playing');
        } else {
            icon.textContent = '▶️';
            text.textContent = 'Play';
            btn.classList.remove('playing');
        }
    }

    // Update speech rate
    function updateSpeechRate() {
        if (currentUtterance) {
            const speedControl = document.getElementById('speedControl');
            if (speedControl) {
                currentUtterance.rate = parseFloat(speedControl.value);
            }
        }
    }

    // Handle page jump
    function handlePageJump(e) {
        const pageNum = e.target.value;
        if (!pageNum) return;

        const pageMarker = document.querySelector(`.page-marker[data-page="${pageNum}"]`);
        if (pageMarker) {
            pageMarker.scrollIntoView({ behavior: 'smooth', block: 'center' });
            pageMarker.style.background = 'var(--secondary-color)';
            pageMarker.style.color = 'white';
            setTimeout(() => {
                pageMarker.style.background = '';
                pageMarker.style.color = '';
            }, 2000);
        }
    }

    // Load reflection questions
    function loadReflectionQuestions() {
        const container = document.getElementById('questionsContainer');
        if (!container || !currentChapter.reflectionQuestions.length) {
            document.getElementById('reflectionSection')?.classList.add('hidden');
            return;
        }

        container.innerHTML = '';
        const answers = getChapterAnswers();

        currentChapter.reflectionQuestions.forEach((question, index) => {
            const questionItem = createQuestionItem(question, index, answers[`q${index}`] || '');
            container.appendChild(questionItem);
        });
    }

    // Create question item
    function createQuestionItem(question, index, savedAnswer) {
        const div = document.createElement('div');
        div.className = 'question-item';

        div.innerHTML = `
            <div class="question-number">Question ${index + 1}</div>
            <div class="question-text">${escapeHtml(question)}</div>
            <textarea
                class="answer-textarea ${savedAnswer ? 'has-content' : ''}"
                data-question="${index}"
                placeholder="Write your thoughts here..."
                rows="5"
            >${escapeHtml(savedAnswer)}</textarea>
            <div class="char-count">
                <span class="count">${savedAnswer.length}</span> characters
            </div>
        `;

        const textarea = div.querySelector('textarea');
        textarea.addEventListener('input', handleAnswerInput);

        return div;
    }

    // Handle answer input
    function handleAnswerInput(e) {
        const textarea = e.target;
        const questionIndex = textarea.dataset.question;
        const answer = textarea.value;

        // Update character count
        const charCount = textarea.parentElement.querySelector('.count');
        if (charCount) {
            charCount.textContent = answer.length;
        }

        // Update styling
        if (answer.trim().length > 0) {
            textarea.classList.add('has-content');
        } else {
            textarea.classList.remove('has-content');
        }

        // Save answer
        saveAnswer(questionIndex, answer);
        updateProgress();
    }

    // Get chapter answers
    function getChapterAnswers() {
        const allAnswers = getAnswers();
        return allAnswers[`chapter_${currentChapter.number}`] || {};
    }

    // Get all answers
    function getAnswers() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.ANSWERS);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Error loading answers:', e);
            return {};
        }
    }

    // Save answer
    function saveAnswer(questionIndex, answer) {
        const allAnswers = getAnswers();
        const chapterKey = `chapter_${currentChapter.number}`;

        if (!allAnswers[chapterKey]) {
            allAnswers[chapterKey] = {};
        }

        allAnswers[chapterKey][`q${questionIndex}`] = answer;

        try {
            localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(allAnswers));
        } catch (e) {
            console.error('Error saving answer:', e);
            alert('Error saving your answer. Your storage may be full.');
        }
    }

    // Email answers
    function emailAnswers() {
        const answers = getChapterAnswers();
        const chapterLabel = currentChapter.number === 0 ? 'Introduction' : `Chapter ${currentChapter.number}`;

        let emailBody = `My Reflections on ${chapterLabel}: ${currentChapter.title}\n`;
        emailBody += `From "Don't Waste Your Life" by John Piper\n\n`;
        emailBody += `${'='.repeat(60)}\n\n`;

        currentChapter.reflectionQuestions.forEach((question, index) => {
            const answer = answers[`q${index}`] || '[Not answered yet]';
            emailBody += `Question ${index + 1}:\n${question}\n\n`;
            emailBody += `My Answer:\n${answer}\n\n`;
            emailBody += `${'-'.repeat(60)}\n\n`;
        });

        const subject = encodeURIComponent(`Reflections: ${currentChapter.title}`);
        const body = encodeURIComponent(emailBody);

        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }

    // Clear answers
    function clearAnswers() {
        if (!confirm('Are you sure you want to clear all your answers for this chapter? This cannot be undone.')) {
            return;
        }

        const allAnswers = getAnswers();
        delete allAnswers[`chapter_${currentChapter.number}`];

        try {
            localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(allAnswers));
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
        const answered = Object.values(answers).filter(a => a && a.trim().length > 0).length;

        progressText.textContent = `${answered} of ${total} questions answered`;
    }

    // Show error
    function showError(message) {
        const container = document.querySelector('.reader-container');
        if (container) {
            container.innerHTML = `
                <div style="padding: 40px; text-align: center;">
                    <h2 style="color: var(--accent-color);">Error</h2>
                    <p>${message}</p>
                    <a href="index.html" class="btn-primary" style="display: inline-block; margin-top: 20px; text-decoration: none;">
                        Return to Home
                    </a>
                </div>
            `;
        }
    }

    // Load voices when available
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
            // Voices loaded
        };
    }

    // Start the reader when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
    });
})();
