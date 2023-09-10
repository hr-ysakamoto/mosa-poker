import * as React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { CacheProvider, EmotionCache } from "@emotion/react";
import "../styles/global.scss";
import theme from "../lib/theme";
import createEmotionCache from "../lib/createEmotionCache";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "../utils/supabase";
import useStore from "../store";
import { useRouter } from "next/router";

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

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const App = (props: MyAppProps) => {
  const session = useStore((state) => state.session);
  const setSession = useStore((state) => state.setSession);
  const router = useRouter();

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  React.useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
    })();
  }, [setSession]);
  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <QueryClientProvider client={queryClient}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <Head>
              <title>Mosa-Poker</title>
            </Head>
            <CssBaseline />
            <main>
              <Component {...pageProps} />
            </main>
          </ThemeProvider>
        </CacheProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
};

export default App;
