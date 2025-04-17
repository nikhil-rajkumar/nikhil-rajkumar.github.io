// Quiz data
const quizData = [
  {
    question: "In what year did the Berlin Wall fall?",
    options: ["1987", "1989", "1991", "1993"],
    correctAnswer: "1989",
    fact: "The Berlin Wall fell on November 9, 1989, marking the beginning of the end of the Cold War and the reunification of Germany."
  },
  {
    question: "Who was the first woman to win a Nobel Prize?",
    options: ["Marie Curie", "Rosalind Franklin", "Jane Goodall", "Dorothy Hodgkin"],
    correctAnswer: "Marie Curie",
    fact: "Marie Curie won the Nobel Prize in Physics in 1903 for her work on radioactivity, and later won the Nobel Prize in Chemistry in 1911."
  }
];

// User responses
let userResponses = {};
let userName = '';

// Initialize the quiz
document.addEventListener('DOMContentLoaded', () => {
  const submitButtons = document.querySelectorAll('.submit-btn');
  const saveResultsBtn = document.getElementById('save-results');
  const startQuizBtn = document.getElementById('start-quiz');
  const nameInput = document.getElementById('user-name');

  // Handle start quiz button
  startQuizBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name) {
      userName = name;
      document.getElementById('login-slide').style.display = 'none';
      document.getElementById('quiz-slide').style.display = 'flex';
    }
  });

  // Handle answer submission for each question
  submitButtons.forEach((btn, index) => {
    if (index < quizData.length) {
      btn.addEventListener('click', () => {
        const questionName = `q${index + 1}`;
        const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);
        const answerReveal = btn.previousElementSibling;
        
        if (selectedOption) {
          userResponses[questionName] = {
            answer: selectedOption.value,
            isCorrect: selectedOption.value === quizData[index].correctAnswer
          };
          
          // Show the answer and fact
          answerReveal.style.display = 'block';
          
          // Disable the radio buttons and submit button
          const options = document.querySelectorAll(`input[name="${questionName}"]`);
          options.forEach(option => option.disabled = true);
          btn.disabled = true;

          // Auto-scroll to next question or results
          setTimeout(() => {
            const nextSlide = document.querySelectorAll('.slide')[index + 2];
            if (nextSlide) {
              nextSlide.scrollIntoView({ behavior: 'smooth' });
            }
          }, 500); // Small delay to let user see the answer
        }
      });
    }
  });

  // Handle saving results
  saveResultsBtn.addEventListener('click', () => {
    if (userName) {
      saveResults(userName);
    }
  });
});

// Function to display results on the page
function showResults(username) {
  try {
    // Create results summary
    let correctCount = 0;
    let totalQuestions = Object.keys(userResponses).length;
    
    Object.values(userResponses).forEach(response => {
      if (response.isCorrect) correctCount++;
    });

    // Create results HTML
    const resultsHTML = `
      <div class="results-container">
        <h2 class="f5 hn-medium">Quiz Results for ${username}</h2>
        <p class="f3 hn-regular">Score: ${correctCount} out of ${totalQuestions}</p>
        <div class="results-details">
          ${Object.entries(userResponses).map(([qNum, response], index) => `
            <div class="result-item">
              <p class="f3 hn-medium">Question ${index + 1}:</p>
              <p class="f2 hn-regular">Your answer: ${response.answer}</p>
              <p class="f2 hn-regular">${response.isCorrect ? '✅ Correct' : '❌ Incorrect'}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Add results to the page
    const resultsSlide = document.createElement('div');
    resultsSlide.className = 'slide';
    resultsSlide.innerHTML = resultsSlide.innerHTML + resultsHTML;
    document.body.appendChild(resultsSlide);

    // Scroll to results
    resultsSlide.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Error showing results:', error);
  }
}

// Function to save results to Google Sheets
async function saveResults(username) {
  try {
    // Format the data for Google Sheets
    const data = {
      username: username,
      timestamp: new Date().toISOString(),
      ...userResponses
    };

    // Replace with your Google Apps Script Web App URL
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxZaHt_tSbiGE9Z87Tc2NCP_1bkP93QHtwd7BjMqGq7pYeVGOaDMF9Xg9LC1pfH8nMsfg/exec';
    
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.json();
      if (result.result === 'success') {
        showResults(username);
      } else {
        throw new Error(result.error || 'Failed to save results');
      }
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error saving results:', error);
    alert(`Error saving results: ${error.message}`);
  }
} 