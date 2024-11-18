import React, { useEffect, useState } from 'react';

const Questions = () => {
  const [questions, setQuestions] = useState([]); // Store all questions
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current question index
  const [selectedOption, setSelectedOption] = useState(null); // Track the selected option
  const [showSolution, setShowSolution] = useState(false); // Control whether the solution is displayed
  const [loading, setLoading] = useState(true); // Indicate loading state
  const [error, setError] = useState(null); // Handle errors

  useEffect(() => {
    // Fetch questions from the FastAPI backend
    fetch('http://127.0.0.1:8000', { method: 'GET' }) // Replace with your FastAPI endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        return response.json();
      })
      .then((data) => {
        setQuestions(data); // Store fetched questions
        setLoading(false); // Loading complete
      })
      .catch((error) => {
        console.error('Error:', error);
        setError(error.message); // Handle fetch error
        setLoading(false);
      });
  }, []);

  const handleContinue = () => {
    // Move to the next question if available
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowSolution(false); // Hide solution when moving to the next question
      setSelectedOption(null); // Reset selected option
    } else {
      alert('No more questions!'); // Notify when out of questions
    }
  };

  const handleShowSolution = () => {
    setShowSolution(true); // Display the solution for the current question
    // Log the selected and correct option
    console.log('Selected Option:', selectedOption);
    console.log('Correct Option:', questions[currentIndex].key);
  };

  const handleOptionSelect = (index) => {
    setSelectedOption(index); // Set the selected option
  };

  if (loading) return <p>Loading...</p>; // Show loading message
  if (error) return <p>Error: {error}</p>; // Show error message
  if (questions.length === 0) return <p>No questions available.</p>; // Handle empty question list

  const currentQuestion = questions[currentIndex]; // Get the current question

  return (
    <div>
      <h1>Question {currentIndex + 1}</h1>
      <p>{currentQuestion.question}</p>
      <ul>
        {currentQuestion.choices.map((option, index) => {
          // Determine styling based on selection and correctness
          let className = '';
          if (showSolution) {
            if (index === currentQuestion.key) {
              className = 'correct'; // Highlight correct option in green
            } else if (index === selectedOption && selectedOption !== currentQuestion.key) {
              className = 'incorrect'; // Highlight incorrect selection in red
            }
          }

          return (
            <li
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`${className} ${index === selectedOption && !showSolution ? 'selected' : ''}`} // Highlight selected option
              style={{
                cursor: 'pointer',
                backgroundColor:
                  className === 'correct'
                    ? 'green'
                    : className === 'incorrect'
                    ? 'red'
                    : index === selectedOption
                    ? '#e0e0e0'
                    : 'transparent',
                color: className ? 'white' : 'black',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '5px',
              }}
            >
              {option}
            </li>
          );
        })}
      </ul>
      {showSolution && selectedOption !== null && (
        <div>
          <h3>
            Your answer is{' '}
            {selectedOption === currentQuestion.key ? 'Correct!' : 'Incorrect.'}
          </h3>
        </div>
      )}
      <div>
        <button onClick={handleShowSolution} disabled={showSolution || selectedOption === null}>
          {showSolution ? 'Solution Shown' : 'Show Solution'}
        </button>
        <button onClick={handleContinue}>Continue</button>
      </div>
    </div>
  );
};

export default Questions;
