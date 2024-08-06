import useDownload from '../hooks/useDownload';
import Search from './Search';

type Props = {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

function Header(props: Props) {
  const download = useDownload();

  return (
    <>
      <div className="navbar bg-base-200">
        <div className="flex-1">
          <a className="text-xl">Minecraft Glyph Database </a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><a onClick={download}>Download</a></li>
            <li><a href='https://github.com/TheWilley/Minecraft-Glyph-Database'>Github</a></li>
            <li>
              <details>
                <summary>Jump To</summary>
                <ul className="bg-base-200 rounded-t-none p-2 z-40">
                  <li><a href='#jumpto-ascii'>ascii</a></li>
                  <li><a href='#jumpto-ascii_sga'>ascii_sga</a></li>
                  <li><a href='#jumpto-asciillager'>asciillager</a></li>
                  <li><a href='#jumpto-accented'>accented</a></li>
                  <li><a href='#jumpto-nonlatin_european'>nonlatin_european</a></li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
        <Search setQuery={props.setQuery}/>
      </div>
    </>
  );
}

export default Header;
