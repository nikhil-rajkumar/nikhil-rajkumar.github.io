document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const startButton = document.getElementById('startButton');
    const optionButtons = document.querySelectorAll('.option-btn');
    const nextButtons = document.querySelectorAll('.next-btn');

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