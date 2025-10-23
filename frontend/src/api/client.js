// frontend/src/api/client.js

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7144',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT ?? 10000),
  withCredentials: false
})

// Logs de todas las requests/responses para que sean "visibles" (sin scaffold)
api.interceptors.request.use((config) => {
  console.log('[API:request]', config.method?.toUpperCase(), config.url, { params: config.params, data: config.data })
  return config
})
api.interceptors.response.use(
  (res) => {
    console.log('[API:response]', res.status, res.config.url, res.data)
    return res
  },
  (err) => {
    const res = err.response
    if (res) console.error('[API:error]', res.status, res.config?.url, res.data)
    else console.error('[API:error]', err.message)
    return Promise.reject(err)
  }
)

export default api
