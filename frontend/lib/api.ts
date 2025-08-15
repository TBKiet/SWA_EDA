import axios from 'axios';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3007';

const api = axios.create({
  baseURL: GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ====================== AUTH ======================
export const registerUser = async (username: string, email: string, password: string) => {
  const res = await api.post('/users', { username, email, password });
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });

  const user = res.data.user;
  if (user && user.id && user.username) {
    localStorage.setItem('user', JSON.stringify({
      userId: user.id,
      username: user.username
    }));
    console.log('✅ user saved to localStorage:', {
      userId: user.id,
      username: user.username
    });
  } else {
    console.warn('❌ Invalid user object in login response:', user);
  }

  return res.data;
};


// ====================== USERS ======================
export const getUsers = () => api.get('/users');
export const getUserById = (id: number) => api.get(`/users/${id}`);

// ====================== EVENTS ======================
export const getEvents = async () => {
  const res = await api.get('/events');
  return res.data;
};

export const fetchEvents = (eventId: number) => api.get(`/events/${eventId}`);
export const fetchAllEvents = async () => {
  const res = await api.get('/events');
  return res.data;
};

export const createEvent = (event: {
  name: string;
  description: string;
  shortDescription: string;
  date: string;
  location: string;
  capacity: number;
  image?: string;
}) => api.post('/events', event);

// ====================== REGISTRATIONS ======================
export const createRegistration = (userId: number, eventId: string) =>
  api.post('/registrations', { userId, eventId });

export const getRegistrations = () => api.get('/registrations');

// ====================== NOTIFICATIONS ======================
export const sendNotification = (userId: number, message: string) =>
  api.post('/notifications', { userId, message });

// ====================== EMAILS ======================
export const sendEmail = (userId: number, subject: string, body: string) =>
  api.post('/emails', { userId, subject, body });

// ====================== AUDIT LOGS ======================
export const getAuditLogs = () => api.get('/auditlogs');

// ====================== HEALTH CHECK ======================
export const healthCheck = () => api.get('/health');

export default api;
