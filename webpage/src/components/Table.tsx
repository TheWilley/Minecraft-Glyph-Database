import { useEffect, useState } from 'react';
import Highlighter from './Highlighter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFont,
  faImage,
  faLocation,
  faTextWidth,
} from '@fortawesome/free-solid-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode';
import { ConvertedData } from '../global/types';

type Props = {
  data: ConvertedData;
  textureKey: keyof ConvertedData;
};

function Table(props: Props) {
  const [highlightedArea, setHighlightedArea] = useState<{ x: number; y: number }>({
    x: -1,
    y: -1,
  });

  const handleHoverChange = (x: number, y: number) => {
    setHighlightedArea({ x, y });
  };

  const resetHighlitedArea = () => {
    setHighlightedArea({ x: -1, y: -1 });
  };

  const scrollTo = (id: string) => {
    // Go to the target
    location.href = '#' + id;

    // Get the element and set offset
    const element = document.getElementById(id);
    const headerOffset = 100;

    // Try to navigate to the element
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Extract the hash part of the URL (e.g., '#U+4C')
    const hash = location.hash;

    if (hash) {
      // Remove the '#' character and scroll to the element with the corresponding ID
      const id = hash.replace('#', '');
      scrollTo(id);
    }
  }, []);

  return (
    <>
      <h1 className='text-3xl w-full rounded-md bg-base-200 p-3 mt-3 sticky top-0 z-30' id={`jumpto-${props.textureKey}`}>
        {props.data[props.textureKey].texture.name}
      </h1>
      <div className='grid grid-cols-1 gap-3 pt-3 md:grid-cols-2'>
        <table
          className='table table-pin-rows table-zebra'
          onMouseOut={resetHighlitedArea}
        >
          <thead>
            <tr className='top-[60px]'>
              <th>
                <div className='tooltip tooltip-bottom' data-tip='Glyph'>
                  <FontAwesomeIcon icon={faImage} />
                </div>
              </th>
              <th>
                <div className='tooltip tooltip-bottom' data-tip='Character'>
                  <FontAwesomeIcon icon={faFont} />
                </div>
              </th>
              <th>
                <div className='tooltip tooltip-bottom' data-tip='Unicode'>
                  <FontAwesomeIcon icon={faCode} />
                </div>
              </th>
              <th>
                <div className='tooltip tooltip-bottom' data-tip='Width'>
                  <FontAwesomeIcon icon={faTextWidth} />
                </div>
              </th>
              <th>
                <div className='tooltip tooltip-bottom' data-tip='Location'>
                  <FontAwesomeIcon icon={faLocation} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {props.data[props.textureKey].glyphs.map(item => (
              <tr
                className='hover:!bg-green-900 cursor-pointer'
                onMouseOver={() =>
                  handleHoverChange(item.gridLocation.y, item.gridLocation.x)
                }
                id={props.textureKey + '-' + item.unicodeCode}
                onClick={() => scrollTo(props.textureKey + '-' + item.unicodeCode)}
                key={props.textureKey + '-' + item.unicodeCode}
              >
                <td>
                  <img src={item.base64Image} className='w-12' />
                </td>
                <td>{item.character}</td>
                <td>{item.unicodeCode}</td>
                <td>{item.characterWidth}</td>
                <td>{`${item.gridLocation.y}-${item.gridLocation.x}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Highlighter
          texture={props.data[props.textureKey].texture}
          highlightedArea={highlightedArea}
        />
      </div>
    </>
  );
}

export default Table;
