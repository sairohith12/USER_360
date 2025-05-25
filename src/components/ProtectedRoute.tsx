// src/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";

export const ProtectedRoute = (WrappedComponent: React.FC) => {
  const ComponentWithAuth: React.FC = (props) => {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoggedIn && router.pathname !== "/login") {
        router.push("/login");
      }
    }, [isLoggedIn, router]);

    if (!isLoggedIn && router.pathname !== "/login") {
      return null; // or loader
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};
