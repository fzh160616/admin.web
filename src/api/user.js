import http from './http'

export function getUserList(params) {
  return http.get('/api/v1/users', { params })
}
