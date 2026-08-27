import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// L'API ne doit jamais pouvoir faire planter l'interface si elle renvoie une
// erreur technique au format objet (par exemple une erreur de connexion MySQL).
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const responseData = error.response?.data;

        if (responseData && typeof responseData.error !== 'string') {
            responseData.error = 'Le serveur rencontre un problème. Réessayez dans quelques instants.';
        }

        return Promise.reject(error);
    }
);

export default api;
