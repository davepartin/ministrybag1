// Main application JavaScript for home page
(function() {
    'use strict';

    // Storage keys
    const STORAGE_KEYS = {
        CHAPTER_PROGRESS: 'dwyl_chapter_progress',
        ANSWERS: 'dwyl_answers'
    };

    // Initialize the app
    function init() {
        loadChapters();
        setupEventListeners();
    }

    // Load and display chapters
    function loadChapters() {
        if (!window.BOOK_DATA) {
            console.error('Book data not loaded');
            return;
        }

        const chaptersGrid = document.querySelector('.chapters-grid');
        if (!chaptersGrid) return;

        chaptersGrid.innerHTML = '';

        window.BOOK_DATA.chapters.forEach(chapter => {
            const card = createChapterCard(chapter);
            chaptersGrid.appendChild(card);
        });
    }

    // Create a chapter card element
    function createChapterCard(chapter) {
        const progress = getChapterProgress(chapter.number);
        const isCompleted = progress.questionsAnswered === chapter.reflectionQuestions.length &&
                          chapter.reflectionQuestions.length > 0;

        const card = document.createElement('a');
        card.href = `reader.html?chapter=${chapter.number}`;
        card.className = `chapter-card ${isCompleted ? 'completed' : ''}`;

        const chapterLabel = chapter.number === 0 ? 'Introduction' : `Chapter ${chapter.number}`;

        card.innerHTML = `
            <div class="chapter-number">${chapterLabel}</div>
            <h3>${chapter.title}</h3>
            <div class="chapter-progress">
                ${progress.questionsAnswered} of ${chapter.reflectionQuestions.length} questions answered
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                </div>
            </div>
        `;

        return card;
    }

    // Get chapter progress from localStorage
    function getChapterProgress(chapterNumber) {
        const answers = getAnswers();
        const chapterAnswers = answers[`chapter_${chapterNumber}`] || {};
        const chapter = window.BOOK_DATA.chapters.find(ch => ch.number === chapterNumber);

        if (!chapter) {
            return { questionsAnswered: 0, total: 0, percentage: 0 };
        }

        const total = chapter.reflectionQuestions.length;
        const answered = Object.values(chapterAnswers).filter(a => a && a.trim().length > 0).length;

        return {
            questionsAnswered: answered,
            total: total,
            percentage: total > 0 ? Math.round((answered / total) * 100) : 0
        };
    }

    // Get all answers from localStorage
    function getAnswers() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.ANSWERS);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Error loading answers:', e);
            return {};
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        const resetBtn = document.getElementById('resetProgress');
        if (resetBtn) {
            resetBtn.addEventListener('click', handleResetProgress);
        }
    }

    // Handle reset progress
    function handleResetProgress() {
        if (confirm('Are you sure you want to reset all your progress and answers? This cannot be undone.')) {
            localStorage.removeItem(STORAGE_KEYS.ANSWERS);
            localStorage.removeItem(STORAGE_KEYS.CHAPTER_PROGRESS);
            loadChapters();
            alert('All progress has been reset.');
        }
    }

    // Start the app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
