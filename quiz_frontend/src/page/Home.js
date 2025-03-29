import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
function Home() {
    const navigate = useNavigate();

    const handleapprovequiz = ()=>{
        navigate("/approve")
    }

    const handlecreatequiz = () => {
        navigate("/create")
    }

    const handleviewquiz = () => {
        navigate("/delete")
    }
    return (
        <div className="home-container">
            <h1 className="home-title">Welcome to the Quiz Creation Platform</h1>
            <p className="home-subtitle">
                Create, Manage, and Approve Quizzes Easily!
            </p>

            <div className="button-container">
                <button className="home-button" onClick={() => handlecreatequiz()}>
                    Create Quiz
                </button>
                <button className="home-button" onClick={() => handleviewquiz()}>
                    View Quizzes
                </button>
                <button className="home-button" onClick={() => handleapprovequiz()}>
                    Approve Quizzes
                </button>
            </div>

            <div className="home-content">
                <h2>How Does It Work?</h2>
                <ol>
                    <li><strong>Create a Quiz:</strong> Enter your quiz questions and answers using our easy-to-use form.</li>
                    <li><strong>View Quizzes:</strong> Access the list of all created quizzes and see their status.</li>
                    <li><strong>Approve Quizzes:</strong> Review pending quizzes and approve them to make them available for users.</li>
                </ol>
            </div>
        </div>
    );
}

export default Home;
