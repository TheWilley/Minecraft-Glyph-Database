import ScrollToTop from 'react-scroll-to-top';
import Container from './components/Container';
import Header from './components/Header';
import TablesList from './components/TablesList';
import useFonts from './hooks/useFonts';
import Error from './components/Error';
import Footer from './components/Footer';
import useSearch from './hooks/useSearch';

function App() {
  const [fonts] = useFonts();
  const [query, setQuery] = useSearch();

  return (
    <Container>
      {fonts ? (
        <>
          <Header setQuery={setQuery} />
          <TablesList fonts={fonts} query={query} />
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
