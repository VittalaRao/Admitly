import { API_URL } from './config'

async function request(path = '', options = {}) {
  let response
  try {
    response = await fetch(`${API_URL}${path}`, options)
  } catch {
    throw new Error('Could not reach the server. Is the backend running?')
  }

  if (response.status === 204) return null

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong.')
  }
  return data
}

function jsonOptions(method, body) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

export const getPatients = () => request()

export const createPatient = (patient) =>
  request('', jsonOptions('POST', patient))

export const updatePatient = (id, patient) =>
  request(`/${id}`, jsonOptions('PUT', patient))

export const dischargePatient = (id) =>
  request(`/${id}/discharge`, { method: 'PATCH' })

export const deletePatient = (id) => request(`/${id}`, { method: 'DELETE' })