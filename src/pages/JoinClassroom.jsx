import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinClassroom } from '../services/api';

const JoinClassroom = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [classroom, setClassroom] = useState(null);
  const [error, setError] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await joinClassroom(code);
      setClassroom(res.classroom);
      localStorage.setItem('rtc_classroom', JSON.stringify(res.classroom));
      navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join classroom');
    }
  };

  return (
    <div className="page page-center">
      <div className="card form-card">
        <h2>Join Classroom</h2>
        <form onSubmit={handleJoin} className="form">
          <label>
            Classroom Code
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
            />
          </label>
          {error && <div className="alert error">{error}</div>}
          <button className="btn primary" type="submit">
            Join
          </button>
        </form>
        {classroom && (
          <div className="info">
            Joined: <strong>{classroom.classroomName}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinClassroom;

