import http from './http'

export function getUserList(params) {
  return http.get('/api/v1/users', { params })
}

export function createUser(data) {
  return http.post('/api/v1/users', data)
}

export function updateUser(id, data) {
  return http.put(`/api/v1/users/${id}`, data)
}

export function updateUserStatus(id, enabled) {
  return http.patch(`/api/v1/users/${id}/status`, { enabled })
}

export function deleteUser(id) {
  return http.delete(`/api/v1/users/${id}`)
}
