import http from './http'

export function register(data) {
  return http.post('/api/v1/auth/register', data)
}

export function login(data) {
  return http.post('/api/v1/auth/login', data)
}
