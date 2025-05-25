export const generateCodeVerifier = () => {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  for (let i = 0; i < 64; i++) {
    text += possible?.charAt(Math?.floor(Math?.random() * possible?.length))
  }
  return text
}

export const generateCodeChallenge = async (codeVerifier: any) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const base64URLHash = base64URL(hashArray)
  return base64URLHash
}

function base64URL(array: any) {
  const str = array.map((byte: any) => String.fromCharCode(byte)).join('')
  const base64 = btoa(str)
  const base64URL = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  return base64URL
}
