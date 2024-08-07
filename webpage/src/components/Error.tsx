import { useEffect, useState } from 'react';

/**
 * Error component.
 *
 * @returns The rendered error component.
 */
function Error() {
  const [longLoadingWarning, setLongLoadingWarning] = useState(false);
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    delay(10000).then(() => setLongLoadingWarning(true));
  }, []);

  return (
    <>
      <div className='h-screen flex items-center justify-center'>
        <div>
          <h1 className='font-bold text-5xl mb-5'>
            {longLoadingWarning ? 'Error' : 'Loading...'}
          </h1>
          {longLoadingWarning && (
            <p className='text-red-500'>
              Could not load glyphs, does "{import.meta.env.VITE_FILE}" exist in the
              public folder?
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Error;
