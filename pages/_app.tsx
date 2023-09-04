import * as React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { CacheProvider, EmotionCache } from "@emotion/react";
import "../styles/global.scss";
import theme from "../lib/theme";
import createEmotionCache from "../lib/createEmotionCache";

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const App = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
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
  );
};

export default App;
