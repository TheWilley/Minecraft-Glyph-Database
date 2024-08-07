import { useRef } from 'react';
import { Texture } from '../global/types';
import useHighlight from '../hooks/useHighlight';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useHighlight(texture, highlightedArea, canvasRef);

  return (
    <div className='overflow-auto max-h-[calc(100vh-80px)] top-[70px] sticky z-10 hidden md:block rounded-md'>
      <canvas
        ref={canvasRef}
        width={texture.size.x}
        height={texture.size.y}
        className='w-full bg-base-200 p-5'
      />
    </div>
  );
}

export default Highlighter;
