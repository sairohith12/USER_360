// pages/_app.tsx
import type { AppProps } from "next/app";
import { ThemeProvider, CssBaseline, Button } from "@mui/material";
import { lightTheme, darkTheme, inter, cinzel } from "@/theme/theme";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/authContext";
import { GuestProvider } from "@/context/guestContext";
import CoreLayout from "@/components/layout/CoreLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import CustomLoader from "@/components/loader";
import { PageLoader } from "@/components/loader/loaderComponent";

type CustomAppProps = AppProps & {
  Component: AppProps["Component"] & { layout?: "none" | string };
};

export default function MyApp({ Component, pageProps }: CustomAppProps) {
  const [mode, setMode] = useState("light");
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = mode === "light" ? lightTheme : darkTheme;
  const LayoutWrapper =
    Component.layout === "none" ? React.Fragment : CoreLayout;

  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Simulate API
  //   setTimeout(() => setLoading(false), 10000);
  // }, []);

  // if (loading) return <PageLoader />;

  return (
    <>
      <Head>
        <title> USER 360| Business Backend </title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <main className={`${inter.variable} ${cinzel.variable}`}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <GuestProvider>
              <ErrorBoundary>
                <LayoutWrapper>
                  {/* <Button onClick={toggleMode}>
                  Toggle {mode === "light" ? "Dark" : "Light"} Mode
                </Button> */}
                  <Component {...pageProps} />
                </LayoutWrapper>
              </ErrorBoundary>
            </GuestProvider>
          </AuthProvider>
        </ThemeProvider>
      </main>
    </>
  );
}
