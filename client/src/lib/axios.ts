import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api', // Adjusted to port 5001 as per user feedback
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
