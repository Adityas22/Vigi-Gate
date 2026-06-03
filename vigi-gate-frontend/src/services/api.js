import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const visitorApi = {
    register: (data) => api.post('/visitors/register', data),
    getActive: () => api.get('/visitors/active'),
    checkout: (id) => api.put(`/visitors/${id}/checkout`),
    getHistory: () => api.get('/visitors/history'),
    getDailySummary: () => api.get('/reports/daily-summary')
};

export default api;
