import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token from localStorage to every request
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('rtc_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (email, password, role) => {
  const res = await apiClient.post('/login', { email, password, role });
  return res.data;
};

export const registerUser = async (name, email, password, role) => {
  const res = await apiClient.post('/auth/register', {
    name,
    email,
    password,
    role,
  });
  return res.data;
};

export const createClassroom = async (classroomName, teacherId) => {
  const res = await apiClient.post('/classroom/create', { classroomName, teacherId });
  return res.data;
};

export const joinClassroom = async (classroomCode) => {
  const res = await apiClient.post('/classroom/join', { classroomCode });
  return res.data;
};

export const askQuestion = async (studentId, classroomId, questionText) => {
  const res = await apiClient.post('/question/ask', {
    studentId,
    classroomId,
    questionText,
  });
  return res.data;
};

export const sendResponseApi = async (teacherId, questionId, responseText) => {
  const res = await apiClient.post('/response/send', {
    teacherId,
    questionId,
    responseText,
  });
  return res.data;
};

