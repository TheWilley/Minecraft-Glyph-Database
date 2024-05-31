
import ScrollToTop from 'react-scroll-to-top';
import Container from './components/Container';
import Header from './components/Header';
import Table from './components/Table';
import Search from './components/Search';
import useData from './hooks/useData';
import Error from './components/Error';
import { useState } from 'react';
import Footer from './components/Footer';

function App() {
  const [data] = useData();
  const [query, setQuery] = useState('');

  return (
    <Container>
      {data ? (
        <>
          <Header />
          <Search setQuery={setQuery} />
          <Table glyphs={data} query={query} />
          <ScrollToTop smooth className='flex justify-center items-center m-auto opacity-30 hover:opacity-100' />
          <Footer />
        </>
      ) : (
        <Error />
      )}
    </Container>
  );
}

export default App;
