import {
  Canvas,
  loadImage,
  type CanvasRenderingContext2D,
  type Image,
} from "skia-canvas";
import type { Glyph, Result, Texture } from "../global/types.js";
import { get2DImageData, getCharWidth } from "./textureHelper.js";
import { getRawCodePoints, splitIntoCharacters } from "./unicodeHelper.js";

/**
 * Main entry point to process a texture into individual glyph objects.
 */
export async function generateGlyphObject(
  texture: Texture,
): Promise<Result<Glyph[], string>> {
  const { buffer, chars, size, dimensions, name } = texture;

  // We can only process if the buffer and chars exists
  if (!buffer || !chars)
    return { ok: false, error: "Buffer and Chars are undefined" };

  const image = await loadImage(buffer);
  const charactersArray = chars.map(splitIntoCharacters);

  const cellWidth = Math.floor(size.width / dimensions.columns);
  const cellHeight = Math.floor(size.height / dimensions.rows);

  // Setup a reusable scratchpad canvas for individual cells
  const cellCanvas = new Canvas(cellWidth, cellHeight);
  const cellContext = cellCanvas.getContext("2d");
  cellContext.imageSmoothingEnabled = false;

  const glyphDataArray: Glyph[] = [];

  for (let row = 0; row < dimensions.rows; row++) {
    for (let col = 0; col < dimensions.columns; col++) {
      const char = charactersArray?.[row]?.[col];
      if (!char) continue;

      const glyph = processCell(
        image,
        cellCanvas,
        cellContext,
        { row, col, width: cellWidth, height: cellHeight },
        char,
        name,
      );

      if (glyph) glyphDataArray.push(glyph);
    }
  }

  return { ok: true, value: glyphDataArray };
}

/**
 * Extracts a single cell from the source image and calculates its metadata.
 */
function processCell(
  sourceImage: Image,
  cellCanvas: Canvas,
  ctx: CanvasRenderingContext2D,
  bounds: { row: number; col: number; width: number; height: number },
  character: string,
  textureName: string,
): Glyph | null {
  const { row, col, width, height } = bounds;

  // Draw the specific region of the spritesheet to our scratchpad
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(
    sourceImage,
    width * col,
    height * row,
    width,
    height, // Source
    0,
    0,
    width,
    height, // Destination
  );

  // Analyze the character data
  // These is some missmatch between CanvasRenderingContext2D here
  // I will fix is sometime
  // @ts-ignore
  const imageData = get2DImageData(ctx);
  const characterWidth = getCharWidth(imageData, character);

  // Skip empty cells
  if (characterWidth <= 0) return null;

  return {
    character,
    characterWidth,
    base64Image: cellCanvas.toDataURL("png"),
    fileName: `${textureName}.png`,
    unicodeCode: `U+${getRawCodePoints(character)}`,
    gridLocation: { x: col, y: row },
  };
}
