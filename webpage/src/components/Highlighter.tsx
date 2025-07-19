import { useRef, useState } from 'react';
import { Texture } from '../global/types';
import useHighlight from '../hooks/useHighlight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from '@react-hook/media-query';

type Props = {
  texture: Texture;
  highlightedArea: { x: number; y: number };
};

/**
 * Highlighter component.
 *
 * @param props - The properties object.
 * @param props.texture - The texture to be highlighted.
 * @param props.highlightedArea - The area to highlight, specified by x and y coordinates.
 * @param props.highlightedArea.x - The x coordinate of the highlighted area.
 * @param props.highlightedArea.y - The y coordinate of the highlighted area.
 * @returns The rendered highlighter component.
 */
function Highlighter({ texture, highlightedArea }: Props) {
  const canvasRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 767px)');
  useHighlight(texture, highlightedArea, canvasRef, isMobile);
  const [isTextureDisplayed, setIsTextureDisplayed] = useState(false); // Initialize to false as checkbox is unchecked by default

  // Handle the change event of the checkbox
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTextureDisplayed(event.target.checked);
  };

  const canvasElement = (
    <div className='rounded-md overflow-auto'>
      <canvas
        ref={canvasRef}
        width={texture.size.width}
        height={texture.size.height}
        className='w-full bg-base-200 p-5'
      />
    </div>
  );
  return (
    <div>
      {isMobile ? (
        <div className='collapse bg-base-100 border-base-300 border fixed w-screen bottom-0 left-0 z-30'>
          <input type='checkbox' onChange={handleCheckboxChange} />
          <div className='collapse-title font-semibold'>
            <FontAwesomeIcon icon={isTextureDisplayed ? faEyeSlash : faEye} />{' '}
            {isTextureDisplayed ? 'Hide Texture' : 'Display Texture'}
          </div>
          <div className='collapse-content'>{canvasElement}</div>
        </div>
      ) : (
        <div className='overflow-auto max-h-[calc(100vh-80px)] top-[130px] lg:top-[70px] sticky z-10'>
          {canvasElement}
        </div>
      )}
    </div>
  );
}

export default Highlighter;
