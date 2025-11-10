import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      localStorage.removeItem('authToken')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }).then((res) => res.data),

  register: (data: { email: string; password: string; name: string }) =>
    apiClient.post('/auth/register', data).then((res) => res.data),

  // Dashboard
  getDashboardStats: () =>
    apiClient.get('/analytics/dashboard').then((res) => res.data),

  // Crossings
  getCrossings: (params?: { status?: string; region?: string }) =>
    apiClient.get('/crossings', { params }).then((res) => res.data),

  getCrossing: (crossingId: string) =>
    apiClient.get(`/crossings/${crossingId}`).then((res) => res.data),

  getCrossingLiveStatus: (crossingId: string) =>
    apiClient.get(`/crossings/${crossingId}/live`).then((res) => res.data),

  // Devices
  getDevices: () => apiClient.get('/devices').then((res) => res.data),

  getDevice: (deviceId: string) =>
    apiClient.get(`/devices/${deviceId}`).then((res) => res.data),

  getDeviceStatus: (deviceId: string) =>
    apiClient.get(`/devices/${deviceId}/status`).then((res) => res.data),

  sendDeviceCommand: (deviceId: string, command: string, params?: any) =>
    apiClient
      .post(`/devices/${deviceId}/command`, { command, params })
      .then((res) => res.data),

  // Alerts
  getAlerts: (params?: {
    status?: string
    severity?: string
    crossingId?: string
    startDate?: string
    endDate?: string
    limit?: number
    offset?: number
  }) => apiClient.get('/alerts', { params }).then((res) => res.data),

  getAlert: (alertId: string) =>
    apiClient.get(`/alerts/${alertId}`).then((res) => res.data),

  acknowledgeAlert: (alertId: string, notes?: string) =>
    apiClient
      .put(`/alerts/${alertId}/acknowledge`, { notes })
      .then((res) => res.data),

  resolveAlert: (alertId: string, resolution: string, notes?: string) =>
    apiClient
      .put(`/alerts/${alertId}/resolve`, { resolution, notes })
      .then((res) => res.data),

  getActiveAlertCounts: () =>
    apiClient.get('/alerts/active/count').then((res) => res.data),

  // Videos
  getVideos: (params?: {
    crossingId?: string
    startDate?: string
    endDate?: string
    limit?: number
    offset?: number
  }) => apiClient.get('/videos', { params }).then((res) => res.data),

  getVideo: (videoId: string) =>
    apiClient.get(`/videos/${videoId}`).then((res) => res.data),

  getLiveStream: (deviceId: string) =>
    apiClient.get(`/videos/live/${deviceId}`).then((res) => res.data),

  // Analytics
  getIncidentAnalytics: (params: {
    startDate?: string
    endDate?: string
    groupBy?: 'hour' | 'day' | 'week' | 'month'
  }) => apiClient.get('/analytics/incidents', { params }).then((res) => res.data),

  getHeatmapData: (params: {
    metric: 'incidents' | 'alerts' | 'traffic'
    startDate?: string
    endDate?: string
  }) => apiClient.get('/analytics/heatmap', { params }).then((res) => res.data),

  getPerformanceMetrics: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get('/analytics/performance', { params }).then((res) => res.data),

  generateReport: (params: {
    reportType: string
    startDate?: string
    endDate?: string
    format?: 'json' | 'csv' | 'pdf'
  }) =>
    apiClient
      .get(`/analytics/reports/${params.reportType}`, {
        params: {
          startDate: params.startDate,
          endDate: params.endDate,
          format: params.format,
        },
      })
      .then((res) => res.data),
}
