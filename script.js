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
  // Get the form element
  const quizForm = document.getElementById('quizForm');
  if (!quizForm) {
    console.error('Quiz form not found');
    return;
  }

  // Handle form submission
  quizForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(quizForm);
    const data = {
      username: formData.get('username'),
      timestamp: new Date().toISOString(),
      q1: formData.get('q1'),
      q2: formData.get('q2'),
      q3: formData.get('q3')
    };

    try {
      console.log('Sending data:', data); // Debug log

      const scriptUrl = 'https://script.google.com/macros/s/AKfycbwTF-PPEiGFpC5CC7e1l77FCY20vyujnQrpFldCAwW9IDOA_k0j1it5tJuKmueiiUd6/exec';
      
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);
      
      if (responseData.result === 'success') {
        showMessage('Your responses have been saved successfully!', 'success');
        quizForm.reset();
      } else {
        throw new Error(responseData.error || 'Failed to save responses');
      }
    } catch (error) {
      console.error('Error saving results:', error);
      showMessage('There was an error saving your responses. Please try again.', 'error');
    }
  });
});

function showMessage(message, type) {
  const messageDiv = document.getElementById('responseMessage');
  if (!messageDiv) {
    console.error('Message div not found');
    return;
  }
  
  messageDiv.textContent = message;
  messageDiv.className = type;
  
  // Clear message after 5 seconds
  setTimeout(() => {
    messageDiv.textContent = '';
    messageDiv.className = '';
  }, 5000);
} 