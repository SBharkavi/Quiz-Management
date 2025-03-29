import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Delete.css";

function Delete() {
    const [quizzes, setQuizzes] = useState([]);

    // Fetch quizzes from the API
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/quizzes/")
            .then((response) => {
                setQuizzes(response.data.quizzes);
            })
            .catch((error) => {
                console.error("Error fetching quizzes:", error);
            });
    }, []);

    // Handle delete quiz
    const handleDelete = (quiz_id) => {
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            axios
                .delete(`http://127.0.0.1:8000/quizzes/${quiz_id}`)
                .then(() => {
                    alert("Quiz deleted successfully!");
                    setQuizzes(quizzes.filter((quiz) => quiz.quiz_id !== quiz_id));
                })
                .catch((error) => {
                    console.error("Error deleting quiz:", error);
                    alert("Failed to delete the quiz. Please try again.");
                });
        }
    };

    return (
        <div className="delete-container">
            <h2>Delete Quizzes</h2>
            <table className="delete-table">
                <thead>
                    <tr>
                        <th>Quiz ID</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Form URL</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {quizzes.map((quiz) => (
                        <tr key={quiz.quiz_id}>
                            <td>{quiz.quiz_id}</td>
                            <td>{quiz.title}</td>
                            <td>{quiz.status}</td>
                            <td className="break-word">
                                <a href={quiz.form_url} target="_blank" rel="noopener noreferrer">
                                    {quiz.form_url}
                                </a>
                            </td>
                            <td>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(quiz.quiz_id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Delete;
