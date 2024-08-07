import { MutableRefObject, useEffect, useRef } from 'react';
import { Texture } from '../global/types';

/**
 * Custom hook to handle highlighting a specific area on a canvas based on a texture.
 *
 * @param texture - The texture containing the image data to be highlighted.
 * @param highlightedArea - The coordinates of the area to highlight.
 * @param canvasRef - A mutable ref object pointing to the canvas element.
 */
export default function useHighlight(
  texture: Texture,
  highlightedArea: { x: number; y: number },
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
) {
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageRef.current) {
      const img = new Image();
      img.src = texture.base64Image;
      imageRef.current = img;
    }
  }, [texture]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const image = imageRef.current;

    if (context && canvas && image) {
      const draw = () => {
        // We don't want the texture to appear blurry
        context.imageSmoothingEnabled = false;
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the entire image with reduced opacity
        context.globalAlpha = 0.2;
        context.drawImage(image, 0, 0, texture.size.x, texture.size.y);

        // Define the clipping region for the area with full opacity
        context.globalAlpha = 1.0;

        // Calculate the scaling factors
        const scaleX = Math.round(texture.size.x / texture.dimensions.x);
        const scaleY = Math.round(texture.size.y / texture.dimensions.y);

        // Calculate the clipping region
        const clipX = highlightedArea.x * scaleX;
        const clipY = highlightedArea.y * scaleY;
        const clipWidth = scaleX; // width in the original image
        const clipHeight = scaleY; // height in the original image

        // Set the clipping path
        context.save(); // Save the current state of the context
        context.beginPath();
        context.rect(clipX, clipY, clipWidth, clipHeight);
        context.clip();

        // Draw the image within the clipping region
        context.drawImage(image, 0, 0, texture.size.x, texture.size.y);
        context.restore(); // Restore the previous state of the context
      };

      if (image.complete) {
        draw();
      } else {
        image.onload = draw;
      }
    }
  }, [highlightedArea, canvasRef, texture.size, texture.dimensions]);
}
