let currentSession = 1;
        let responses = JSON.parse(localStorage.getItem('christianFoundationsResponses') || '{}');
        
        // Question counts per session for progress tracking
        const sessionQuestionCounts = {
            1: 5, // 4 questions + 1 prayer requests
            2: 8, // 6 questions + notes + prayer requests  
            3: 9, // 7 questions + notes + prayer requests
            4: 7, // 5 questions + notes + prayer requests
            5: 7, // 5 questions + notes + prayer requests
            6: 8, // 6 questions + notes + prayer requests
            7: 8  // 6 questions + notes + prayer requests
        };
        
        document.addEventListener('DOMContentLoaded', function() {
            loadAllResponses();
            updateOverallProgress();
            updateSessionDots();
            updateNavigationButtons();
            
            // Add event listeners to all textareas and radio buttons
            document.querySelectorAll('.response-box').forEach(textarea => {
                textarea.addEventListener('input', function() {
                    saveResponse(this);
                    updateOverallProgress();
                    updateSessionDots();
                });
            });
            
            // Handle radio button commitment
            document.querySelectorAll('input[name="commitment"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    responses['commitment'] = this.value;
                    localStorage.setItem('christianFoundationsResponses', JSON.stringify(responses));
                    showSavedIndicator('saved-1-4');
                    updateOverallProgress();
                    updateSessionDots();
                });
            });
        });
        
        function showSession(sessionNum) {
            // Hide all sessions
            document.querySelectorAll('.session').forEach(session => {
                session.classList.remove('active');
            });
            
            // Show selected session
            document.getElementById(`session-${sessionNum}`).classList.add('active');
            
            // Update tabs
            document.querySelectorAll('.nav-tabs button').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(`tab-${sessionNum}`).classList.add('active');
            
            currentSession = sessionNum;
            updateNavigationButtons();
            updateSessionDots();
        }
        
        function nextSession() {
            if (currentSession < 7) {
                showSession(currentSession + 1);
            }
        }
        
        function previousSession() {
            if (currentSession > 1) {
                showSession(currentSession - 1);
            }
        }
        
        function updateNavigationButtons() {
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            
            if (currentSession === 1) {
                prevBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'block';
            }
            
            if (currentSession === 7) {
                nextBtn.textContent = '🎉 Course Complete!';
                nextBtn.style.background = '#27ae60';
                nextBtn.onclick = () => alert('Congratulations on completing the Christian Foundations Course!');
            } else {
                nextBtn.textContent = 'Next Session →';
                nextBtn.style.background = '#3498db';
                nextBtn.onclick = nextSession;
            }
        }
        
        function loadAllResponses() {
            // Load text responses
            document.querySelectorAll('.response-box').forEach(textarea => {
                const questionId = textarea.id;
                if (responses[questionId]) {
                    textarea.value = responses[questionId];
                }
            });
            
            // Load radio button commitment
            if (responses['commitment']) {
                const radio = document.querySelector(`input[name="commitment"][value="${responses['commitment']}"]`);
                if (radio) radio.checked = true;
            }
        }
        
        function saveResponse(element) {
            const questionId = element.id;
            const answer = element.value;
            
            responses[questionId] = answer;
            localStorage.setItem('christianFoundationsResponses', JSON.stringify(responses));
            
            // Show saved indicator
            const indicatorId = 'saved-' + questionId.replace('question-', '').replace('-', '-');
            showSavedIndicator(indicatorId);
        }
        
        function showSavedIndicator(indicatorId) {
            const indicator = document.getElementById(indicatorId);
            if (indicator) {
                indicator.classList.add('show');
                setTimeout(() => {
                    indicator.classList.remove('show');
                }, 2000);
            }
        }
        
        function updateOverallProgress() {
            let totalQuestions = 0;
            let completedQuestions = 0;
            
            // Count all questions across all sessions
            Object.values(sessionQuestionCounts).forEach(count => {
                totalQuestions += count;
            });
            
            // Count completed responses (including commitment radio button)
            const allResponses = Object.keys(responses).filter(key => {
                const value = responses[key];
                return value && value.toString().trim().length > 0;
            });
            
            completedQuestions = allResponses.length;
            
            const percentage = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;
            
            document.getElementById('overall-progress-fill').style.width = percentage + '%';
            document.getElementById('overall-progress-text').textContent = 
                `${completedQuestions} of ${totalQuestions} questions completed (${Math.round(percentage)}%)`;
        }
        
        function updateSessionDots() {
            for (let i = 1; i <= 7; i++) {
                const dot = document.getElementById(`dot-${i}`);
                const sessionQuestions = getSessionQuestions(i);
                const completedInSession = sessionQuestions.filter(qId => 
                    responses[qId] && responses[qId].toString().trim().length > 0
                ).length;
                
                const sessionTotal = sessionQuestionCounts[i];
                const sessionPercentage = sessionTotal > 0 ? (completedInSession / sessionTotal) : 0;
                
                dot.classList.remove('completed', 'current');
                
                if (i === currentSession) {
                    dot.classList.add('current');
                } else if (sessionPercentage >= 0.8) { // 80% completion threshold
                    dot.classList.add('completed');
                }
            }
        }
        
        function getSessionQuestions(sessionNum) {
            const questions = [];
            
            // Get all question IDs for a specific session
            const sessionElement = document.getElementById(`session-${sessionNum}`);
            if (sessionElement) {
                const textareas = sessionElement.querySelectorAll('.response-box');
                textareas.forEach(textarea => {
                    questions.push(textarea.id);
                });
            }
            
            // Add radio button for session 1
            if (sessionNum === 1) {
                questions.push('commitment');
            }
            
            return questions;
        }
        
        function exportAllResponses() {
            let emailBody = "Christian Foundations Course - Complete Journey\n";
            emailBody += "=" + "=".repeat(50) + "\n\n";
            
            for (let session = 1; session <= 7; session++) {
                const sessionTitles = {
                    1: "Session 1: Introduction to the Course & Each Other",
                    2: "Session 2: Salvation and Baptism", 
                    3: "Session 3: Prayer",
                    4: "Session 4: Bible",
                    5: "Session 5: Church",
                    6: "Session 6: Evangelism",
                    7: "Session 7: Life of Repentance"
                };
                
                emailBody += sessionTitles[session] + "\n";
                emailBody += "-".repeat(sessionTitles[session].length) + "\n\n";
                
                const sessionElement = document.getElementById(`session-${session}`);
                if (sessionElement) {
                    const textareas = sessionElement.querySelectorAll('.response-box');
                    textareas.forEach(textarea => {
                        const question = textarea.dataset.question || textarea.id;
                        const answer = textarea.value || '[No response]';
                        emailBody += question + "\n" + answer + "\n\n";
                    });
                }
                
                // Add commitment for session 1
                if (session === 1 && responses['commitment']) {
                    emailBody += "1.4 - Course Commitment\n" + responses['commitment'] + "\n\n";
                }
                
                emailBody += "\n";
            }
            
            const subject = "My Christian Foundations Course - Complete Journey";
            const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
            window.location.href = mailtoLink;
        }
        
        function printAllResponses() {
            let printContent = "<h1>Christian Foundations Course - Complete Journey</h1>";
            
            for (let session = 1; session <= 7; session++) {
                const sessionTitles = {
                    1: "Session 1: Introduction to the Course & Each Other",
                    2: "Session 2: Salvation and Baptism", 
                    3: "Session 3: Prayer",
                    4: "Session 4: Bible",
                    5: "Session 5: Church",
                    6: "Session 6: Evangelism",
                    7: "Session 7: Life of Repentance"
                };
                
                printContent += `<h2>${sessionTitles[session]}</h2>`;
                
                const sessionElement = document.getElementById(`session-${session}`);
                if (sessionElement) {
                    const textareas = sessionElement.querySelectorAll('.response-box');
                    textareas.forEach(textarea => {
                        const question = textarea.dataset.question || textarea.id;
                        const answer = textarea.value || '[No response]';
                        printContent += `<h3>${question}</h3><p>${answer.replace(/\n/g, '<br>')}</p>`;
                    });
                }
                
                // Add commitment for session 1
                if (session === 1 && responses['commitment']) {
                    printContent += `<h3>1.4 - Course Commitment</h3><p>${responses['commitment']}</p>`;
                }
                
                printContent += "<br><br>";
            }
            
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Christian Foundations Course Journey</title>
                        <style>
                            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                            h1 { color: #2c3e50; text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
                            h2 { color: #3498db; margin-top: 30px; }
                            h3 { color: #2c3e50; margin-top: 20px; }
                            p { margin-bottom: 15px; line-height: 1.6; }
                        </style>
                    </head>
                    <body>
                        ${printContent}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
        
        function clearAllData() {
            if (confirm('Are you sure you want to clear ALL your responses from the entire course? This cannot be undone.')) {
                localStorage.removeItem('christianFoundationsResponses');
                responses = {};
                
                // Clear all textareas
                document.querySelectorAll('.response-box').forEach(textarea => {
                    textarea.value = '';
                });
                
                // Clear radio buttons
                document.querySelectorAll('input[name="commitment"]').forEach(radio => {
                    radio.checked = false;
                });
                
                updateOverallProgress();
                updateSessionDots();
                alert('All course data has been cleared.');
            }
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'ArrowLeft' && currentSession > 1) {
                    e.preventDefault();
                    previousSession();
                } else if (e.key === 'ArrowRight' && currentSession < 7) {
                    e.preventDefault();
                    nextSession();
                }
            }
        });
        
        // Auto-save every 30 seconds
        setInterval(() => {
            if (Object.keys(responses).length > 0) {
                localStorage.setItem('christianFoundationsResponses', JSON.stringify(responses));
            }
        }, 30000);