import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="page page-center">
      <div className="card hero-card">
        <h1>Real-Time Classroom Assistance</h1>
        <p>
          A modern platform for teachers and students to interact in real-time with instant
          questions and responses.
        </p>
        <div className="button-row">
          <Link to="/login" className="btn primary">
            Login
          </Link>
          <Link to="/register" className="btn ghost">
            Register
          </Link>
          <Link to="/join" className="btn ghost">
            Join Classroom
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

