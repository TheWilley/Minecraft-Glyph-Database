import ScrollToTop from 'react-scroll-to-top';
import Container from './components/Container';
import Header from './components/Header';
import useFonts from './hooks/useFonts';
import Footer from './components/Footer';
import useSearch from './hooks/useSearch';
import Loader from './components/Loader';
import { useState } from 'react';
import Table from './components/Table';

const fontKeys = [
  'ascii',
  'ascii_sga',
  'asciillager',
  'accented',
  'nonlatin_european',
] as const;

export type FontKey = (typeof fontKeys)[number];

function App() {
  const [loadedCount, setLoadedCount] = useState(0);
  const [fonts] = useFonts();
  const [query, setQuery] = useSearch();

  const isLoaded = fonts && loadedCount === fontKeys.length;

  return (
    <Container>
      <>
        <Header setQuery={setQuery} />
        <div style={{ visibility: isLoaded ? 'visible' : 'hidden' }}>
          {fontKeys.map((fontKey) => (
            <Table
              key={fontKey}
              fontKey={fontKey}
              fonts={fonts}
              query={query}
              setLoadedCount={setLoadedCount}
            />
          ))}
        </div>

        {!isLoaded && <Loader />}

        <ScrollToTop
          smooth
          className='flex justify-center items-center m-auto opacity-30 hover:opacity-100'
        />
        <Footer />
      </>
    </Container>
  );
}

export default App;
