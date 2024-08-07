import useDownload from '../hooks/useDownload';
import Search from './Search';

type Props = {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

/**
 * Header component.
 *
 * @param props - The properties object.
 * @param props.setQuery - Function to set the query state.
 * @returns The rendered header component.
 */
function Header(props: Props) {
  const download = useDownload();

  return (
    <>
      <div className='navbar bg-base-200'>
        <div className='flex-1'>
          <h1 className='text-xl hidden md:block font-bold'>Minecraft Glyph Database </h1>
          <h1 className='text-xl block md:hidden font-bold'>MGD </h1>
        </div>
        <div className='flex-none'>
          <ul className='menu menu-horizontal px-1'>
            <li className='hidden sm:block'>
              <a onClick={download}>Download</a>
            </li>
            <li>
              <a href='https://github.com/TheWilley/Minecraft-Glyph-Database'>Github</a>
            </li>
            <li>
              <details>
                <summary>Jump To</summary>
                <ul className='bg-base-200 rounded-t-none p-2 z-40'>
                  <li>
                    <a href='#jumpto-ascii'>ascii</a>
                  </li>
                  <li>
                    <a href='#jumpto-ascii_sga'>ascii_sga</a>
                  </li>
                  <li>
                    <a href='#jumpto-asciillager'>asciillager</a>
                  </li>
                  <li>
                    <a href='#jumpto-accented'>accented</a>
                  </li>
                  <li>
                    <a href='#jumpto-nonlatin_european'>nonlatin_european</a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <Search setQuery={props.setQuery} />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Header;
