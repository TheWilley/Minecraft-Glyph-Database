import { useEffect, useState } from 'react';

/**
 * Error component.
 *
 * @returns The rendered error component.
 */
function Loader() {
  const [longLoadingWarning, setLongLoadingWarning] = useState(false);
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    delay(10000).then(() => setLongLoadingWarning(true));
  }, []);

  return (
    <>
      {longLoadingWarning ? (
        <p className=' mt-5 text-error text-xl'>
          ERROR: Could not load glyphs, does "glyphs.json" exist in the
          public folder?
        </p>
      ) : (
        <>
          <div className='skeleton h-14 w-full mt-2' />
          <div className='grid grid-cols-1 gap-3 pt-3 md:grid-cols-2'>
            <div className='skeleton h-screen w-full' />
            <div className='skeleton h-screen w-full' />
          </div>
        </>
      )}
    </>
  );
}

export default Loader;
