
export const generateHeader = (options = {}) => {
  const { needAuth = true, contentType = 'json' } = options
  const headers = {
    'Content-Type': contentType === 'form' 
      ? 'application/x-www-form-urlencoded' 
      : 'application/json'
  }
  
  if (needAuth) {
    const token = getToken()
    headers.Authorization = `Bearer ${token}`
  }
  
  return headers
}