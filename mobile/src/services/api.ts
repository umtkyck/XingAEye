import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = 'http://localhost:3000' // Change to your API URL

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken')
      // Navigate to login screen
    }
    return Promise.reject(error)
  }
)

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }).then((res) => res.data),

  // Dashboard
  getDashboardStats: () =>
    apiClient.get('/analytics/dashboard').then((res) => res.data),

  // Crossings
  getCrossings: (params?: { status?: string; region?: string }) =>
    apiClient.get('/crossings', { params }).then((res) => res.data),

  getCrossing: (crossingId: string) =>
    apiClient.get(`/crossings/${crossingId}`).then((res) => res.data),

  // Devices
  getDevices: () => apiClient.get('/devices').then((res) => res.data),

  // Alerts
  getAlerts: (params?: {
    status?: string
    severity?: string
    crossingId?: string
    limit?: number
  }) => apiClient.get('/alerts', { params }).then((res) => res.data),

  acknowledgeAlert: (alertId: string, notes?: string) =>
    apiClient
      .put(`/alerts/${alertId}/acknowledge`, { notes })
      .then((res) => res.data),

  // Videos
  getVideos: (params?: { crossingId?: string; limit?: number }) =>
    apiClient.get('/videos', { params }).then((res) => res.data),

  getLiveStream: (deviceId: string) =>
    apiClient.get(`/videos/live/${deviceId}`).then((res) => res.data),
}
