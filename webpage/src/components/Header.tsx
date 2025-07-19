import { Link } from 'react-router-dom';
import useDownload from '../hooks/useDownload';
import Search from './Search';

type Props = {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  timestamp: number | undefined,
  minecraftVersion: string | undefined
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
      <div className='navbar bg-base-200 rounded-md'>
        <div className='flex-1 text-left'>
          <h1 className='text-xl hidden md:block font-bold'>Minecraft Glyph Database </h1>
          <h1 className='text-xl block md:hidden font-bold'>MGD </h1>
          <div className='text-gray-400'>Minecraft Version <b>{props.minecraftVersion || '?'}</b></div>
          <div className='text-gray-400'>Updated on <b>{props.timestamp ? new Date(props.timestamp).toLocaleDateString() : '?'}</b></div>
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
                <summary>Go To</summary>
                <ul
                  className='bg-base-200 rounded-t-none p-2 z-40'
                >
                  <li>
                    <Link to='ascii'>
                      ascii
                    </Link>
                  </li>
                  <li>
                    <Link to='ascii_sga'>
                      ascii_sga
                    </Link>
                  </li>
                  <li>
                    <Link to='asciillager'>
                      asciillager
                    </Link>
                  </li>
                  <li>
                    <Link to='accented'>
                      accented
                    </Link>
                  </li>
                  <li>
                    <Link to='nonlatin_european'>
                      nonlatin_european
                    </Link>
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
