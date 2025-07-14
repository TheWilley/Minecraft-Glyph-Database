import Highlighter from './Highlighter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFont,
  faImage,
  faLocation,
  faTextWidth,
  faCode,
} from '@fortawesome/free-solid-svg-icons';
import { Fonts } from '../global/types';
import useTable from '../hooks/useTable';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';

// --- New Components for Readability ---

/**
 * Displays key metadata about the font texture.
 */
function FontMetadata({ currentFonts }: { currentFonts: Fonts[keyof Fonts] }) {
  return (
    <div className='items-center gap-1 text-sm text-base-content/80 overflow-x-auto text-nowrap'>
      <div className='badge'>
        <span className='font-semibold'>Size:</span> {currentFonts.texture.size.x} x{' '}
        {currentFonts.texture.size.y}
      </div>
      <div className='badge'>
        <span className='font-semibold'>Dimensions:</span>{' '}
        {currentFonts.texture.dimensions.x - 1} x {currentFonts.texture.dimensions.y - 1}
      </div>
      <div className='badge'>
        <span className='font-semibold'>Glyphs:</span> {currentFonts.glyphs.length}
      </div>
      <div className='badge'>
        <span className='font-semibold'>Format:</span> PNG
      </div>
    </div>
  );
}

/**
 * Renders breadcrumbs for navigation within the font display.
 */
function Breadcrumbs({
  fontName,
  hash,
  scrollTo,
  isHiddenLg = false,
}: {
  fontName: string;
  hash: string | null;
  scrollTo: (id: string) => void;
  isHiddenLg?: boolean;
}) {
  return (
    <div
      className={`badge badge-secondary ${isHiddenLg ? 'flex lg:hidden w-full mb-2' : 'hidden lg:flex'}`}
    >
      <div className='breadcrumbs text-sm'>
        <ul>
          <li>
            <span className='hover:underline cursor-pointer' onClick={() => scrollTo('')}>
              {fontName}
            </span>
          </li>
          <li>
            <span
              className='hover:underline cursor-pointer'
              onClick={() => hash && scrollTo(hash)}
            >
              {hash || '?'}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// --- Main Table Component ---

type Props = {
  fonts: Fonts | undefined;
  fontKey: keyof Fonts;
  query: string;
  setIsLoaded: Dispatch<SetStateAction<boolean>>;
};

/**
 * Table component for displaying font glyphs and their properties.
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
    hash,
    handleHoverChange,
    highlightedArea,
    resetHighlitedArea,
    scrollTo,
  } = useTable(props.fonts, props.fontKey, props.query);

  const currentFonts = useMemo(
    () => props.fonts && props.fonts[props.fontKey],
    [props.fontKey, props.fonts]
  );

  useEffect(() => {
    props.setIsLoaded(true);
  }, []);

  // Early return if no fonts or filtered fonts are available
  if (!currentFonts || !filteredFonts?.length) {
    return <></>;
  }

  return (
    <>
      <div className='w-full rounded-md bg-base-200 p-4 mt-3 sticky top-0 z-30 shadow-md'>
        <div className='items-center justify-between lg:flex overflow-x-auto '>
          {/* Font Name */}
          <div className='badge badge-primary w-full lg:w-fit text-lg px-4 py-2 font-mono mb-2 lg:mb-0'>
            {currentFonts.texture.name}
          </div>

          {/* Current Path - Mobile & Tablet */}
          <Breadcrumbs
            fontName={currentFonts.texture.name}
            hash={hash}
            scrollTo={scrollTo}
            isHiddenLg={true}
          />

          {/* Metadata Section */}
          <FontMetadata currentFonts={currentFonts} />

          {/* Current Path - Desktop */}
          <Breadcrumbs
            fontName={currentFonts.texture.name}
            hash={hash}
            scrollTo={scrollTo}
          />
        </div>
      </div>
      <div className='grid grid-cols-1 gap-3 pt-3 md:grid-cols-2'>
        <table
          className='table table-pin-rows table-zebra'
          onMouseOut={() => resetHighlitedArea()}
        >
          <thead>
            <tr className='top-[120px] lg:top-[55px]'>
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
            {filteredFonts.map((item) => (
              <tr
                className='hover:bg-green-300 dark:hover:!bg-green-900 cursor-pointer'
                onMouseOver={() =>
                  handleHoverChange(item.gridLocation.y, item.gridLocation.x)
                }
                id={item.unicodeCode}
                onClick={() => scrollTo(item.unicodeCode)}
                key={item.unicodeCode}
              >
                <td>
                  <img
                    src={item.base64Image}
                    className='w-12 invert dark:invert-0'
                    alt={item.character}
                  />
                </td>
                <td>{item.character}</td>
                <td>{item.unicodeCode}</td>
                <td>{item.characterWidth}</td>
                <td>{`${item.gridLocation.y}-${item.gridLocation.x}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Highlighter texture={currentFonts.texture} highlightedArea={highlightedArea} />
      </div>
    </>
  );
}

export default Table;
