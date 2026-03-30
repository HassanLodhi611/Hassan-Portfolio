import axios from 'axios';

const API = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || '/api',
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('hl_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — clear token and redirect to login
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hl_token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

// ─── Auth ──────────────────────────────────────────
export const login = (creds)      => API.post('/auth/login', creds);
export const verifyToken = ()     => API.get('/auth/verify');

// ─── Projects ──────────────────────────────────────
export const getProjects    = (params) => API.get('/projects', { params });
export const createProject  = (fd)     => API.post('/projects', fd);
export const updateProject  = (id, fd) => API.put(`/projects/${id}`, fd);
export const deleteProject  = (id)     => API.delete(`/projects/${id}`);

// ─── Certificates ──────────────────────────────────
export const getCertificates   = ()       => API.get('/certificates');
export const createCertificate = (fd)     => API.post('/certificates', fd);
export const updateCertificate = (id, fd) => API.put(`/certificates/${id}`, fd);
export const deleteCertificate = (id)     => API.delete(`/certificates/${id}`);

// ─── Skills ────────────────────────────────────────
export const getSkills    = ()       => API.get('/skills');
export const createSkill  = (data)   => API.post('/skills', data);
export const updateSkill  = (id, d)  => API.put(`/skills/${id}`, d);
export const deleteSkill  = (id)     => API.delete(`/skills/${id}`);

// ─── About ─────────────────────────────────────────
export const getAbout    = ()        => API.get('/about');
export const updateAbout = (fd)      => API.put('/about', fd);

// ─── Contact ───────────────────────────────────────
export const sendMessage  = (data)   => API.post('/contact', data);
export const getMessages  = ()       => API.get('/contact');
export const markRead     = (id)     => API.patch(`/contact/${id}/read`);

export default API;
