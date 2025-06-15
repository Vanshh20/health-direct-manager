import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

export const managerSignin = async (data) => {
  try {
    const response = await api.post('/auth/manager-signin', data);
    return response;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response;
  } catch (error) {
    console.error('Get Profile Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await api.put('/profile', data);
    return response;
  } catch (error) {
    console.error('Update Profile Error:', error.response?.data || error.message);
    throw error;
  }
};

export const addDoctor = async (data) => {
  try {
    const response = await api.post('/doctors', data);
    return response;
  } catch (error) {
    console.error('Add Doctor Error:', error.response?.data || error.message);
    throw error;
  }
};

export const getDoctors = async () => {
  try {
    const response = await api.get('/doctors');
    return response;
  } catch (error) {
    console.error('Get Doctors Error:', error.response?.data || error.message);
    throw error;
  }
};

export const getDoctor = async (id) => {
  try {
    const response = await api.get(`/doctors/${id}`);
    return response;
  } catch (error) {
    console.error('Get Doctor Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateDoctor = async (id, data) => {
  try {
    const response = await api.put(`/doctors/${id}`, data);
    return response;
  } catch (error) {
    console.error('Update Doctor Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteDoctor = async (id) => {
  try {
    const response = await api.delete(`/doctors/${id}`);
    return response;
  } catch (error) {
    console.error('Delete Doctor Error:', error.response?.data || error.message);
    throw error;
  }
};