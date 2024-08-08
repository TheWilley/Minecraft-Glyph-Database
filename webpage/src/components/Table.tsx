import Highlighter from './Highlighter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFont,
  faImage,
  faLocation,
  faTextWidth,
} from '@fortawesome/free-solid-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode';
import { Fonts } from '../global/types';
import useTable from '../hooks/useTable';

type Props = {
  fonts: Fonts;
  fontKey: keyof Fonts;
  query: string;
};

/**
 * Table component.
 *
 * @param props - The properties object.
 * @param props.fonts - The collection of fonts to be displayed or used in the table.
 * @param props.fontKey - The key of the font to be used from the fonts collection.
 * @param props.query - The search query or filter term to apply to the table.
 * @returns The rendered table component.
 */
function Table(props: Props) {
  const {
    filteredFonts,
    handleHoverChange,
    highlightedArea,
    resetHighlitedArea,
    scrollTo,
  } = useTable(props.fonts, props.fontKey, props.query);

  return filteredFonts?.length ? (
    <>
      <h1
        className='text-3xl w-full rounded-md bg-base-200 p-3 mt-3 sticky top-0 z-30'
        id={`jumpto-${props.fontKey}`}
      >
        {props.fonts[props.fontKey].texture.name}
      </h1>
      <div className='grid grid-cols-1 gap-3 pt-3 md:grid-cols-2'>
        <table
          className='table table-pin-rows table-zebra'
          onMouseOut={() => resetHighlitedArea}
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
            {filteredFonts?.map((item) => (
              <tr
                className='hover:bg-green-300 dark:hover:!bg-green-900 cursor-pointer'
                onMouseOver={() =>
                  handleHoverChange(item.gridLocation.y, item.gridLocation.x)
                }
                id={props.fontKey + '-' + item.unicodeCode}
                onClick={() => scrollTo(props.fontKey + '-' + item.unicodeCode)}
                key={props.fontKey + '-' + item.unicodeCode}
              >
                <td>
                  <img src={item.base64Image} className='w-12 invert dark:invert-0' />
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
          texture={props.fonts[props.fontKey].texture}
          highlightedArea={highlightedArea}
        />
      </div>
    </>
  ) : (
    <></>
  );
}

export default Table;
