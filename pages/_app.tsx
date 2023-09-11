import { useState } from "react";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "../styles/global.scss";
import theme from "../lib/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      suspense: true,
    },
  },
});

const App: NextPage<AppProps> = ({ pageProps, Component }: AppProps) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Head>
            <title>mosa-poker</title>
          </Head>
          <CssBaseline />
          <main>
            <Component {...pageProps} />
          </main>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
};

export default App;
