import { HashRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import ScrollToTop from 'react-scroll-to-top';
import Container from './components/Container';
import Header from './components/Header';
import useFonts from './hooks/useFonts';
import useSearch from './hooks/useSearch';
import Table from './components/Table';
import { useState } from 'react';
import Loader from './components/Loader';
import { Fonts } from './global/types';

const fontKeys = [
  'ascii',
  'ascii_sga',
  'asciillager',
  'accented',
  'nonlatin_european',
] as const;

export type FontKey = (typeof fontKeys)[number];

function FontTableWrapper({ fonts, query }: { fonts: Fonts | undefined; query: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { fontKey } = useParams<{ fontKey: string }>();

  if (!fonts) return <Loader />;

  if (!fontKeys.includes(fontKey as FontKey)) {
    return <Navigate to={`/${fontKeys[0]}`} replace />;
  }

  return (
    <>
      {!isLoaded && <Loader />}
      <div style={{ visibility: isLoaded ? 'visible' : 'hidden' }}>
        <Table
          fontKey={fontKey as FontKey}
          fonts={fonts}
          query={query}
          setIsLoaded={setIsLoaded}
        />
      </div>
    </>
  );
}

function App() {
  const [fonts, metadata] = useFonts();
  const [query, setQuery] = useSearch();

  return (
    <HashRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Container>
        <Header setQuery={setQuery} timestamp={metadata?.timestamp} minecraftVersion={metadata?.minecraftVersion} />
        <Routes>
          <Route path='/' element={<Navigate to={`/${fontKeys[0]}`} replace />} />
          <Route
            path='/:fontKey'
            element={<FontTableWrapper fonts={fonts} query={query} />}
          />
        </Routes>
        <ScrollToTop
          smooth
          className='flex justify-center items-center m-auto opacity-30 hover:opacity-100 mb-8 md:mb-0'
        />
      </Container>
    </HashRouter>
  );
}

export default App;
