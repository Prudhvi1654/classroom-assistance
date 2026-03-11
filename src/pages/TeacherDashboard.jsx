import React, { useEffect, useState } from 'react';
import { createClassroom, sendResponseApi } from '../services/api';
import { socket } from '../socket/socket';

const TeacherDashboard = () => {
  const [user] = useState(() => JSON.parse(localStorage.getItem('rtc_user') || '{}'));
  const [classroom, setClassroom] = useState(
    () => JSON.parse(localStorage.getItem('rtc_classroom') || 'null')
  );
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    if (classroom && classroom._id) {
      socket.emit('joinClassroom', { classroomId: classroom._id });
    }
  }, [classroom]);

  useEffect(() => {
    socket.on('newQuestion', (question) => {
      setQuestions((prev) => [...prev, question]);
    });

    return () => {
      socket.off('newQuestion');
    };
  }, []);

  const handleCreateClassroom = async () => {
    if (!user?.id) return;
    const name = prompt('Enter classroom name');
    if (!name) return;
    const res = await createClassroom(name, user.id);
    setClassroom(res.classroom);
    localStorage.setItem('rtc_classroom', JSON.stringify(res.classroom));
    socket.emit('joinClassroom', { classroomId: res.classroom._id });
  };

  const handleSendResponse = async () => {
    if (!selectedQuestion || !responseText.trim()) return;
    try {
      await sendResponseApi(user.id, selectedQuestion._id, responseText);
      setResponseText('');
    } catch (err) {
      // In a real app you might show a toast; keep silent to avoid theory text.
      console.error('Failed to send response', err);
    }
  };

  return (
    <div className="page dashboard">
      <div className="dashboard-header">
        <h2>Teacher Dashboard</h2>
        <div>
          {classroom ? (
            <div className="badge">
              Classroom: {classroom.classroomName} ({classroom.classroomCode})
            </div>
          ) : (
            <button className="btn primary" onClick={handleCreateClassroom}>
              Create Classroom
            </button>
          )}
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="card list-card">
          <h3>Incoming Questions</h3>
          {questions.length === 0 && <p className="muted">No questions yet.</p>}
          <ul className="question-list">
            {questions.map((q) => (
              <li
                key={q._id}
                className={`question-item ${
                  selectedQuestion?._id === q._id ? 'selected' : ''
                }`}
                onClick={() => setSelectedQuestion(q)}
              >
                <div className="question-text">{q.questionText}</div>
                <div className="question-meta">
                  <span>Student: {q.studentId}</span>
                  <span>{new Date(q.timestamp).toLocaleTimeString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card chat-card">
          <h3>Respond</h3>
          {selectedQuestion ? (
            <>
              <div className="chat-thread">
                <div className="bubble question">
                  <div className="bubble-label">Question</div>
                  <div>{selectedQuestion.questionText}</div>
                </div>
              </div>
              <textarea
                className="input-textarea"
                placeholder="Type your response..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
              />
              <button className="btn primary" onClick={handleSendResponse}>
                Send Response
              </button>
            </>
          ) : (
            <p className="muted">Select a question to respond.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

