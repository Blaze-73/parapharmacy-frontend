import axios from 'axios'
import toast from 'react-hot-toast'

// Use the environment variable for the base URL, otherwise fallback to localhost
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: { 
    'Content-Type': 'application/json', 
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': '69420' // This stops the Ngrok warning page from blocking your API
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/connexion'
    } else if (err.response?.status >= 500) {
      toast.error('Erreur serveur. Veuillez réessayer.')
    }
    return Promise.reject(err)
  }
)

export default api
