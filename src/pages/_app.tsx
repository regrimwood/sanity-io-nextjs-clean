import '../styles/globals.css';
import { lazy } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import type { AppContext, AppProps } from 'next/app';
import createEmotionCache from '../utils/createEmotionCache';
import theme from '../styles/theme/theme';
import App from 'next/app';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface SharedPageProps {
  draftMode: boolean;
  token: string;
}

interface MyAppProps extends SharedPageProps, AppProps {
  emotionCache?: EmotionCache;
}

const PreviewProvider = lazy(() => import('~/components/PreviewProvider'));

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) {
  const { draftMode, token } = pageProps;
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {draftMode ? (
          <PreviewProvider token={token}>
            <Component {...pageProps} />
          </PreviewProvider>
        ) : (
          <Component {...pageProps} />
        )}
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};

export default MyApp;
