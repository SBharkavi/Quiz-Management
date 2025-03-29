import React, { useState, useEffect } from "react";
import axios from "axios";
import "./approve.css";

function Approve() {
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState("");
    const [approved, setApproved] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState(null);

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

    // Handle email change
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    // Handle approve button click
    const handleApprove = () => {
        const approvalData = {
            approved: true,
            email: email,
        };

        axios
            .post(`http://127.0.0.1:8000/quizzes/${selectedQuizId}/approve`, approvalData)
            .then((response) => {
                console.log("Approval Data:", response.data);
                setApproved(true);
                setShowModal(false);
                alert("Quiz Approved and Email Sent!");
            })
            .catch((error) => {
                console.error("Error approving quiz:", error);
                alert("Failed to approve the quiz. Please try again.");
            });
    };

    return (
        <div className="approve-container">
            <h2>Approve Quizzes</h2>
            <table className="quiz-table">
                <thead>
                    <tr>
                        <th>Quiz ID</th>
                        <th>Quiz Name</th>
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
                            <td>
                                <a href={quiz.form_url} target="_blank" rel="noopener noreferrer">
                                    {quiz.form_url}
                                </a>
                            </td>
                            <td>
                                {quiz.status !== "approved" && (
                                    <button
                                        onClick={() => {
                                            setSelectedQuizId(quiz.quiz_id);
                                            setShowModal(true);
                                        }}
                                        className="approve-btn"
                                    >
                                        Approve
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Enter Email for Approval</h3>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <button onClick={handleApprove} className="modal-approve-btn">
                            Send Approval
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className="modal-cancel-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {approved && (
                <p className="success-message">Quiz Approved Successfully!</p>
            )}
        </div>
    );
}

export default Approve;
