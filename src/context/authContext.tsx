// src/context/authContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import api from 'api/axios'

export type UserType = 'admin' | 'editor' | 'viewer' | 'super_admin' | null

interface User {
  email: string
  firstName: string
  lastName: string
  employeeId: string
  propertyName: string
  propertyId: string
  role: UserType
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string) => Promise<void>
  verifyOtp: (email: string | undefined, otp: string) => Promise<void>
  logout: () => void
  accessToken: string | null
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType>(null)
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  // const [refreshToken, setRefreshToken] = useState<string | null>(null)

  const login = async (email: string) => {
    try {
      const response = await api.post('/auth/login', { email })
      return response
    } catch (error) {
      console.error('Login failed', error)
      throw error
    }
  }

  const verifyOtp = async (email: string | undefined, otp: string) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp })

      if (response.status == 200) {
        const { refreshToken, user_role, name } = response.data
        const { access_token: accessToken } = response?.headers
        setAccessToken(accessToken)
        // setRefreshToken(refreshToken)
        const user = {
          firstName: name,
          email: email || '',
          employeeId: '77878',
          lastName: name,
          propertyId: '898343',
          propertyName: 'Taj lands end',
          role: user_role,
        }
        setUser(user)
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('user', JSON.stringify(user))
        if (!user_role) return
        Cookies.set('userType', user_role, { expires: 1 })
        setUserType(user_role)
      }
      return { ...response, success: response.status == 200 ? true : false }
    } catch (error) {
      console.error('OTP verification failed', error)
      throw error
    }
  }

  const logout = async () => {
    const responseError = await api.post('/auth/logout', { email: user?.email })
    setUser(null)
    setAccessToken(null)
    // setRefreshToken(null)
    localStorage.clear()
    router.push('/login')
  }

  // Check if user is already authenticated in localStorage
  useEffect(() => {
    const savedUserType = Cookies.get('userType') as UserType | undefined
    if (savedUserType) {
      setUserType(savedUserType)
    } else {
      const publicRoutes = ['/login']
      // Redirect to login only if not already on login page
      if (
        router.pathname !== '/login' ||
        (!savedUserType && !publicRoutes.includes(router.pathname))
      ) {
        router.push('/login')
      }
    }
  }, [router])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me')
        setUser(res.data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    //fetchUser()
  }, [])

  const value = {
    userType,
    isLoggedIn: !!userType,
    login,
    logout,
    user,
    loading,
    verifyOtp,
    accessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

// To protect routes
export const withAuth = (Component: React.FC) => {
  return function ProtectedRoute(props: React.ComponentProps<typeof Component>) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login')
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, user])

    if (loading || !user) return null
    return <Component {...props} />
  }
}
