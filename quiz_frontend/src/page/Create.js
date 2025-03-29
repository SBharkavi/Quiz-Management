import React, { useState } from "react";
import "./Create.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Create() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([
        { question: "", options: ["", "", "", ""] },
    ]);

    // Handle title change
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    // Handle question change
    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = value;
        setQuestions(updatedQuestions);
    };

    // Handle option change
    const handleOptionChange = (qIndex, oIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[oIndex] = value;
        setQuestions(updatedQuestions);
    };

    // Add a new question
    const addQuestion = () => {
        setQuestions([...questions, { question: "", options: ["", "", "", ""] }]);
    };

    // Submit the quiz
    const handleSubmit = async () => {
        const quizData = {
            title: title,
            questions: questions,
        };
        
        try {
            const response = await axios.post("http://127.0.0.1:8000/quizzes/", quizData);
            alert("Quiz created successfully!");
            console.log("Response:", response.data);
            navigate("/");
        } catch (error) {
            console.error("Error creating quiz:", error);
            alert("Failed to create quiz. Please try again.");
        }
    };

    return (
        <div className="create-container">
            <h2>Create a Quiz</h2>
            <label>Quiz Title:</label>
            <input
                type="text"
                placeholder="Enter Quiz Title"
                value={title}
                onChange={handleTitleChange}
                className="title-input"
            />

            {questions.map((q, qIndex) => (
                <div key={qIndex} className="question-block">
                    <label>Question {qIndex + 1}:</label>
                    <input
                        type="text"
                        placeholder="Enter Question"
                        value={q.question}
                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                        className="question-input"
                    />
                    {q.options.map((opt, oIndex) => (
                        <input
                            key={oIndex}
                            type="text"
                            placeholder={`Option ${oIndex + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            className="option-input"
                        />
                    ))}
                </div>
            ))}

            <button onClick={addQuestion} className="add-btn">
                Add Question
            </button>
            <button onClick={handleSubmit} className="submit-btn">
                Submit Quiz
            </button>
        </div>
    );
}

export default Create;
