import api from 'api/axios'

const handleApiCall = async (endpoint: string, payload: any, headers: any = {}) => {
  try {
    const response = await api.post(endpoint, payload, { headers })
    return response
  } catch (error: any) {
    throw error?.response?.data?.message || 'Something went wrong'
  }
}
