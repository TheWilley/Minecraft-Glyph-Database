import ScrollToTop from 'react-scroll-to-top';
import Container from './components/Container';
import Header from './components/Header';
import TablesList from './components/TablesList';
import useData from './hooks/useData';
import Error from './components/Error';
import Footer from './components/Footer';
import useSearch from './hooks/useSearch';

function App() {
  const [data] = useData();
  const [query, setQuery] = useSearch();

  return (
    <Container>
      {data ? (
        <>
          <Header setQuery={setQuery} />
          <TablesList data={data} query={query} />
          <ScrollToTop
            smooth
            className='flex justify-center items-center m-auto opacity-30 hover:opacity-100'
          />
          <Footer />
        </>
      ) : (
        <Error />
      )}
    </Container>
  );
}

export default App;
