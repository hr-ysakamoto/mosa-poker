import { CacheProvider, EmotionCache } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import "../styles/global.scss";
import createEmotionCache from "../lib/createEmotionCache";
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

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}
const clientSideEmotionCache = createEmotionCache();

const App: NextPage<MyAppProps> = ({
  pageProps,
  Component,
  emotionCache,
}: MyAppProps) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  emotionCache = clientSideEmotionCache;
  return (
    <CacheProvider value={emotionCache}>
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
    </CacheProvider>
  );
};

export default App;
