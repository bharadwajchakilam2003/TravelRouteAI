import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface SearchParams {
  source: string;
  destination: string;
  travelDate?: string;
  returnDate?: string;
  travelers?: number;
}

export const searchAPI = {
  search: (params: SearchParams) =>
    api.post('/search', params).then((res) => res.data),
  getHistory: () =>
    api.get('/search/history').then((res) => res.data),
};

export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data).then((res) => res.data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then((res) => res.data),
  googleLogin: (idToken: string) =>
    api.post('/auth/google', { idToken }).then((res) => res.data),
  getMe: () =>
    api.get('/auth/me').then((res) => res.data),
  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.put('/auth/profile', data).then((res) => res.data),
};

export const tripsAPI = {
  getAll: () =>
    api.get('/trips').then((res) => res.data),
  getById: (id: string) =>
    api.get(`/trips/${id}`).then((res) => res.data),
  save: (data: any) =>
    api.post('/trips', data).then((res) => res.data),
  update: (id: string, data: any) =>
    api.put(`/trips/${id}`, data).then((res) => res.data),
  delete: (id: string) =>
    api.delete(`/trips/${id}`).then((res) => res.data),
};

export const weatherAPI = {
  get: (lat: number, lng: number, days?: number) =>
    api.get('/weather', { params: { lat, lng, days } }).then((res) => res.data),
};

export const placesAPI = {
  getAttractions: (lat: number, lng: number, radius?: number) =>
    api.get('/places/attractions', { params: { lat, lng, radius } }).then((res) => res.data),
  getNearby: (lat: number, lng: number, type?: string, radius?: number) =>
    api.get('/places/nearby', { params: { lat, lng, type, radius } }).then((res) => res.data),
  getPlaceDetails: (placeId: string) =>
    api.get(`/places/details/${placeId}`).then((res) => res.data),
  getCitiesOnRoute: (sourceLat: number, sourceLng: number, destLat: number, destLng: number) =>
    api.get('/places/cities-on-route', { params: { sourceLat, sourceLng, destLat, destLng } }).then((res) => res.data),
  getFamousIndianPlaces: (search?: string) =>
    api.get('/places/famous-indian-places', { params: search ? { search } : {} }).then((res) => res.data),
};

export const aiAPI = {
  chat: (message: string, context?: any) =>
    api.post('/ai/chat', { message, context }).then((res) => res.data),
  clearHistory: () =>
    api.post('/ai/clear').then((res) => res.data),
};

export const adminAPI = {
  getDashboard: () =>
    api.get('/admin/dashboard').then((res) => res.data),
  getUsers: (page?: number) =>
    api.get('/admin/users', { params: { page } }).then((res) => res.data),
  deleteUser: (id: string) =>
    api.delete(`/admin/users/${id}`).then((res) => res.data),
  getSearches: (page?: number) =>
    api.get('/admin/searches', { params: { page } }).then((res) => res.data),
  getTrips: (page?: number) =>
    api.get('/admin/trips', { params: { page } }).then((res) => res.data),
};

export default api;
