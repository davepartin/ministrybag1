let currentSession = 1;
        let responses = JSON.parse(localStorage.getItem('christianFoundationsResponses') || '{}');
        

        
        document.addEventListener('DOMContentLoaded', function() {
            loadAllResponses();
            updateNavigationButtons();
            
            // Add event listeners to all textareas and radio buttons
            document.querySelectorAll('.response-box').forEach(textarea => {
                textarea.addEventListener('input', function() {
                    saveResponse(this);
                });
            });
            
            // Handle radio button commitment
            document.querySelectorAll('input[name="commitment"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    responses['commitment'] = this.value;
                    localStorage.setItem('christianFoundationsResponses', JSON.stringify(responses));
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
                nextBtn.style.display = 'none';
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