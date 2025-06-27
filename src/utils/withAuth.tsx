// utils/withAuth.tsx
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth, UserType } from '../context/authContext'
import MainLayout from '@/components/layout/CoreLayout'

interface Options {
  roles?: UserType[] // Optional: restrict to specific roles
  redirectTo?: string // Optional: default is "/"
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Options = {},
): React.FC<P> {
  const { roles, redirectTo = '/' } = options

  const Wrapper: React.FC<P> = (props) => {
    const { isLoggedIn, userType } = useAuth()
    const router = useRouter()

    const isAuthorized = isLoggedIn && (!roles || (userType && roles.includes(userType)))

    useEffect(() => {
      if (!isAuthorized) {
        router.replace(redirectTo)
      }
    }, [isAuthorized, router])

    if (!isAuthorized) {
      return (
        <MainLayout>
          <h1>Unauthorized</h1>
          <p>You do not have access to this page.</p>
        </MainLayout>
      )
    }

    return <Component {...props} />
  }

  return Wrapper
}
