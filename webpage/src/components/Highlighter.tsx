import { useRef } from 'react';
import { Texture } from '../global/types';
import useHighlight from '../hooks/useHighlight';

type Props = {
  texture: Texture;
  highlightedArea: { x: number; y: number };
};

function Highlighter({ texture, highlightedArea }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useHighlight(texture, highlightedArea, canvasRef);

  return (
    <canvas
      ref={canvasRef}
      width={texture.size.x}
      height={texture.size.y}
      className='top-[70px] sticky z-10 p-5 rounded-md bg-base-200 hidden md:block w-full overflow-auto'
    />
  );
}

export default Highlighter;
