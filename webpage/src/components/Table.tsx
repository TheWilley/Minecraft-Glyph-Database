import { useState } from 'react';
import Highlighter from './Highlighter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFont,
  faHashtag,
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
