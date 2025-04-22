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
    saveResultsButton.addEventListener('click', async () => {
        const userName = userNameInput.value.trim();
        if (!userName) {
            alert('Please enter your name');
            return;
        }

        userResponses.name = userName;
        
        try {
            // First, get the current content of the file
            const getResponse = await fetch('https://api.github.com/repos/nikhil-rajkumar/nikhil-rajkumar.github.io/contents/data/responses.json', {
                headers: {
                    'Authorization': 'token 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'
                }
            });

            if (!getResponse.ok) {
                throw new Error('Failed to fetch existing data');
            }

            const existingData = await getResponse.json();
            const currentContent = JSON.parse(atob(existingData.content));
            
            // Add the new response to the existing data
            currentContent.responses.push(userResponses);

            // Update the file
            const updateResponse = await fetch('https://api.github.com/repos/nikhil-rajkumar/nikhil-rajkumar.github.io/contents/data/responses.json', {
                method: 'PUT',
                headers: {
                    'Authorization': 'token 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',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Add response from ${userName}`,
                    content: btoa(JSON.stringify(currentContent, null, 2)),
                    sha: existingData.sha,
                    branch: 'main'
                })
            });

            if (updateResponse.ok) {
                alert('Your results have been saved!');
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                throw new Error('Failed to save results');
            }
        } catch (error) {
            console.error('Error saving results:', error);
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