// Node.js script to parse the book text file and generate book-data.js
const fs = require('fs');
const path = require('path');

// Read the text file
const textFile = path.join(__dirname, '..', 'don-t-waste-your-life-en-smaller.txt');
const content = fs.readFileSync(textFile, 'utf-8');
const lines = content.split('\n');

// Chapter definitions based on table of contents
const chapterDefs = [
    { number: 0, title: "Preface", start: null },
    { number: 1, title: "My Search for a Single Passion to Live By", start: null },
    { number: 2, title: "Breakthrough—The Beauty of Christ, My Joy", start: null },
    { number: 3, title: "Boasting Only in the Cross, the Blazing Center of the Glory of God", start: null },
    { number: 4, title: "Magnifying Christ through Pain and Death", start: null },
    { number: 5, title: "Risk Is Right—Better to Lose Your Life Than to Waste It", start: null },
    { number: 6, title: "The Goal of Life—Gladly Making Others Glad in God", start: null },
    { number: 7, title: "Living to Prove He Is More Precious Than Life", start: null },
    { number: 8, title: "Making Much of Christ from 8 to 5", start: null },
    { number: 9, title: "The Majesty of Christ in Missions and Mercy: A Plea to This Generation", start: null },
    { number: 10, title: "My Prayer—Let None Say in the End, \"I've Wasted It\"", start: null }
];

// Find chapter start lines
for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === 'Preface' && i > 200) {
        chapterDefs[0].start = i;
    } else if (line === 'My Search for a Single') {
        chapterDefs[1].start = i;
    } else if (line.startsWith('Breakthrough—')) {
        chapterDefs[2].start = i;
    } else if (line.startsWith('Boasting Only in the Cross')) {
        chapterDefs[3].start = i;
    } else if (line.startsWith('Magnifying Christ through Pain')) {
        chapterDefs[4].start = i;
    } else if (line.startsWith('Risk Is Right—')) {
        chapterDefs[5].start = i;
    } else if (line.startsWith('The Goal of Life—')) {
        chapterDefs[6].start = i;
    } else if (line.startsWith('Living to Prove')) {
        chapterDefs[7].start = i;
    } else if (line.startsWith('Making Much of Christ')) {
        chapterDefs[8].start = i;
    } else if (line.startsWith('The Majesty of Christ')) {
        chapterDefs[9].start = i;
    } else if (line.startsWith('My Prayer—')) {
        chapterDefs[10].start = i;
    }
}

// Extract chapter content
const chapters = [];
for (let i = 0; i < chapterDefs.length; i++) {
    const chap = chapterDefs[i];
    if (chap.start === null) continue;

    const nextStart = i + 1 < chapterDefs.length && chapterDefs[i + 1].start !== null
        ? chapterDefs[i + 1].start
        : lines.length;

    const chapterLines = lines.slice(chap.start, nextStart);
    const text = chapterLines.join('\n').trim();

    // Extract page numbers (look for standalone numbers)
    const pageNumbers = [];
    const contentLines = [];
    let currentPage = null;

    for (const line of chapterLines) {
        const trimmed = line.trim();
        // Check if line is just a number (page marker)
        if (/^\d+$/.test(trimmed) && parseInt(trimmed) > 10) {
            currentPage = parseInt(trimmed);
            if (!pageNumbers.includes(currentPage)) {
                pageNumbers.push(currentPage);
            }
            contentLines.push(`[PAGE ${currentPage}]`);
        } else {
            contentLines.push(line);
        }
    }

    chapters.push({
        number: chap.number,
        title: chap.title,
        content: contentLines.join('\n').trim(),
        pageNumbers: pageNumbers.sort((a, b) => a - b)
    });
}

// Reflection questions for each chapter (thoughtful, deep questions)
const reflectionQuestions = {
    0: [ // Preface
        "What does it mean to you personally to 'not waste your life'? How do you currently measure whether your life has meaning?",
        "John Piper contrasts being 'moved' by something with finding true meaning. What's the difference, and why does it matter?",
        "How does the warning that 'the path of God-exalting joy will cost you your life' challenge or inspire you?",
        "What are you currently treasuring above Christ? How can you identify and surrender these things?",
        "If you were to die today, would you feel you had wasted your life? Why or why not? What would you change?"
    ],
    1: [
        "What 'single passion' are you currently living by? Is it worthy of your whole life?",
        "How has your upbringing or past experiences shaped your understanding of what makes a life meaningful?",
        "The old man wept 'I've wasted it!' What would make you feel this way at the end of your life?",
        "What fears or comfort zones are keeping you from living with radical, Christ-centered purpose?",
        "If you knew you couldn't fail, what would you do differently with your life to magnify Christ?"
    ],
    2: [
        "What has been your personal 'breakthrough' moment in understanding who Christ is and what He means to you?",
        "How does the beauty of Christ compete with other sources of joy and satisfaction in your life?",
        "In what practical ways can you cultivate a deeper experience of joy in Christ this week?",
        "What obstacles or distractions are currently preventing you from seeing and savoring Christ more fully?",
        "How would your daily decisions change if Christ truly became your supreme treasure and joy?"
    ],
    3: [
        "What does it mean practically to 'boast only in the cross'? What are you currently boasting in instead?",
        "How does viewing all good things as 'blood-bought evidence of Christ's love' change the way you enjoy them?",
        "In what ways are you still 'alive to the world' rather than dead to it and alive to Christ?",
        "How can you trace your daily joys back to joy in Christ crucified?",
        "What would it look like for the cross to become the 'blazing center' of your life this week?"
    ],
    4: [
        "How do you typically respond to pain and suffering? Does it magnify or obscure Christ in your life?",
        "What does it mean that 'to live is Christ and to die is gain'? Do you truly believe this?",
        "How can suffering and even death become occasions to display Christ's worth to others?",
        "What fears about pain, loss, or death are you holding onto? How does Christ address these fears?",
        "How would you want to face death when it comes? What preparation can you make now?"
    ],
    5: [
        "What risks is God calling you to take for His kingdom? What holds you back from taking them?",
        "How has comfort and security become more important to you than radical obedience to Christ?",
        "What would it look like to live with the mindset that 'it is better to lose your life than to waste it'?",
        "In what areas of your life are you playing it safe rather than risking for Christ?",
        "If you fully trusted God's sovereignty and goodness, what bold step would you take?"
    ],
    6: [
        "How are you currently making others glad in God? Who in your life needs to see this joy?",
        "What's the difference between making people happy and making them glad in God?",
        "How can you be more intentional about pointing people to God as the source of true joy?",
        "Who has helped make you glad in God? How can you follow their example?",
        "What practical steps can you take this week to redirect conversations and relationships toward God's glory?"
    ],
    7: [
        "In what ways does your life currently prove that Christ is more precious than life itself?",
        "What would you be unwilling to give up for Christ? What does that reveal about your heart?",
        "How can you demonstrate Christ's supreme value in your daily choices, not just in crisis moments?",
        "What specific sacrifices is God calling you to make to show that Christ is your greatest treasure?",
        "How does your use of time, money, and energy reflect what you truly value most?"
    ],
    8: [
        "How can you make much of Christ in your daily work or studies (your '8 to 5')?",
        "Do you view your job/studies as a means to make money or as a platform to glorify God? What's the difference?",
        "What would change about your work ethic and attitude if you saw your work as worship?",
        "How can you be a 'smell of Christ' to your coworkers, classmates, or those you interact with daily?",
        "What opportunities do you have in your daily routine to demonstrate the worth of Christ to others?"
    ],
    9: [
        "How does God's heart for the nations and the poor challenge your current priorities and lifestyle?",
        "What role should missions and mercy play in your life, regardless of your vocation?",
        "How can you participate in God's global mission from where you are right now?",
        "What needs around you (locally or globally) is God calling you to address with the love of Christ?",
        "How would your budget, schedule, and prayers change if you took seriously the call to make Christ known to all peoples?"
    ],
    10: [
        "After reading this book, what is one specific change you will make in how you live?",
        "What would prevent you from saying at the end of your life, 'I've wasted it'?",
        "How will you hold yourself accountable to living a Christ-exalting, un-wasted life?",
        "What legacy do you want to leave that points people to the supremacy of Christ?",
        "What prayer do you have for your own life after engaging with these truths? Write it out."
    ]
};

// Generate book-data.js file
const bookData = {
    title: "Don't Waste Your Life",
    author: "John Piper",
    chapters: chapters.map(ch => ({
        number: ch.number,
        title: ch.title,
        content: ch.content,
        pageNumbers: ch.pageNumbers,
        reflectionQuestions: reflectionQuestions[ch.number] || []
    }))
};

const outputContent = `// Auto-generated book data
// Generated: ${new Date().toISOString()}

const BOOK_DATA = ${JSON.stringify(bookData, null, 2)};

// Export for use in browser
if (typeof window !== 'undefined') {
    window.BOOK_DATA = BOOK_DATA;
}
`;

const outputPath = path.join(__dirname, 'book-data.js');
fs.writeFileSync(outputPath, outputContent, 'utf-8');

console.log(`✓ Generated book-data.js with ${chapters.length} chapters`);
chapters.forEach(ch => {
    console.log(`  - Chapter ${ch.number}: ${ch.title} (${ch.pageNumbers.length} pages)`);
});
