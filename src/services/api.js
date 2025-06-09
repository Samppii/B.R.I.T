// src/services/api.js
import axios from 'axios';

const britApi = {
    sendMessage: async (message) => {
        try {
            const response = await axios.post('/api/brit/', { message });
            return response.data;
        } catch (error) {
            console.error('Error sending message to BRIT:', error);
            throw error;
        }
    }
};

export default britApi;