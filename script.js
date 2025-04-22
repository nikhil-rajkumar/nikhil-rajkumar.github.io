document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const startButton = document.getElementById('startButton');
    const optionButtons = document.querySelectorAll('.option-btn');
    const nextButtons = document.querySelectorAll('.next-btn');
    const saveResultsButton = document.getElementById('saveResults');
    const userNameInput = document.getElementById('userName');

    let userResponses = {
        answers: [],
        timestamp: new Date().toISOString()
    };

    // Start button click handler
    startButton.addEventListener('click', () => {
        window.scrollTo({
            top: sections[1].offsetTop,
            behavior: 'smooth'
        });
    });

    // Option button click handlers
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentQuestion = button.closest('.section');
            const currentOptions = currentQuestion.querySelectorAll('.option-btn');
            
            currentOptions.forEach(btn => {
                btn.disabled = true;
                if (btn.hasAttribute('data-correct')) {
                    btn.classList.add('correct');
                } else {
                    btn.classList.add('incorrect');
                }
            });

            // Store the response
            const questionText = currentQuestion.querySelector('p').textContent;
            const selectedAnswer = button.textContent;
            const isCorrect = button.hasAttribute('data-correct');
            
            userResponses.answers.push({
                question: questionText,
                answer: selectedAnswer,
                isCorrect: isCorrect
            });

            // Find the next section (answer section)
            const currentSection = button.closest('.section');
            const nextSection = currentSection.nextElementSibling;
            
            if (nextSection) {
                window.scrollTo({
                    top: nextSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Save results button click handler
    saveResultsButton.addEventListener('click', () => {
        const userName = userNameInput.value.trim();
        if (!userName) {
            alert('Please enter your name');
            return;
        }

        userResponses.name = userName;
        
        try {
            // Save to Firebase
            const responsesRef = database.ref('responses');
            responsesRef.push(userResponses)
                .then(() => {
                    // Calculate score
                    const score = userResponses.answers.filter(answer => answer.isCorrect).length;
                    const total = userResponses.answers.length;
                    
                    alert(`Your results have been saved!\nScore: ${score}/${total} correct answers`);
                    
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                })
                .catch((error) => {
                    console.error('Error saving to Firebase:', error);
                    alert('There was an error saving your results. Please try again later.');
                });
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error saving your results. Please try again later.');
        }
    });

    // Next button click handlers
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentSection = button.closest('.section');
            const nextSection = currentSection.nextElementSibling;
            
            // Check if this is the last "Restart Journey" button
            if (button.textContent === 'Restart Journey') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            if (nextSection) {
                window.scrollTo({
                    top: nextSection.offsetTop,
                    behavior: 'smooth'
                });
                
                // Reset option buttons for the next question
                const nextQuestionOptions = nextSection.querySelectorAll('.option-btn');
                if (nextQuestionOptions.length > 0) {
                    nextQuestionOptions.forEach(btn => {
                        btn.disabled = false;
                        btn.classList.remove('correct', 'incorrect');
                    });
                }
            }
        });
    });
}); 