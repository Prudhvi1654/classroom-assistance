import React, { useEffect, useState } from 'react';
import { askQuestion } from '../services/api';
import { socket } from '../socket/socket';

const StudentDashboard = () => {
  const [user] = useState(() => JSON.parse(localStorage.getItem('rtc_user') || '{}'));
  const [classroom] = useState(
    () => JSON.parse(localStorage.getItem('rtc_classroom') || 'null')
  );
  const [questionText, setQuestionText] = useState('');
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    if (classroom && classroom._id) {
      socket.emit('joinClassroom', { classroomId: classroom._id });
    }
  }, [classroom]);

  useEffect(() => {
    socket.on('receiveResponse', (response) => {
      setResponses((prev) => [...prev, response]);
    });

    return () => {
      socket.off('receiveResponse');
    };
  }, []);

  const handleAskQuestion = async () => {
    if (!questionText.trim() || !user?.id || !classroom?._id) return;
    await askQuestion(user.id, classroom._id, questionText);
    setQuestionText('');
  };

  return (
    <div className="page dashboard">
      <div className="dashboard-header">
        <h2>Student Dashboard</h2>
        {classroom && (
          <div className="badge">
            Classroom: {classroom.classroomName} ({classroom.classroomCode})
          </div>
        )}
      </div>
      <div className="dashboard-grid">
        <div className="card chat-card">
          <h3>Ask a Question</h3>
          <textarea
            className="input-textarea"
            placeholder="Type your question..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          <button className="btn primary" onClick={handleAskQuestion}>
            Send Question
          </button>
        </div>
        <div className="card list-card">
          <h3>Responses</h3>
          {responses.length === 0 && <p className="muted">No responses yet.</p>}
          <div className="chat-thread">
            {responses.map((r) => (
              <div key={r._id} className="bubble response">
                <div className="bubble-label">Teacher</div>
                <div>{r.responseText}</div>
                <div className="bubble-meta">
                  {new Date(r.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

