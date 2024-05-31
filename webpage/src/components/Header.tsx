import useDownload from '../hooks/useDownload';

function Header() {
  const download = useDownload();


  return (
    <>
      <h1 className='text-2xl font-bold mb-2'> Minecraft Glyph Database </h1>
      <div className='mb-3'>
        <a className='link text-blue-400' onClick={download}>Download</a>
        <span> • </span>
        <a href="https://github.com/TheWilley/Minecraft-Glyph-Database" className='link text-blue-400'>Github</a>
      </div>
    </>
  );
}

export default Header;