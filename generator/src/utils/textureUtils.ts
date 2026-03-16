import type { Pixel } from "../global/types.js";

/**
 * Converts the image data from a canvas context into a 2D array of RGBA values.
 * @param ctx The canvas rendering context.
 * @returns A 2D array where each element is an object with r, g, b, and a properties.
 */
export function get2DImageData(ctx: CanvasRenderingContext2D) {
  // Get the dimensions of the canvas
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // Get the image data from the canvas context
  const imageData = ctx.getImageData(0, 0, width, height);

  // The imageData.data property is a Uint8ClampedArray containing the RGBA values
  const data = imageData.data;

  // Create an empty array to hold the pixel data
  const pixels = [];

  // Loop through each row of the image
  for (let y = 0; y < height; y++) {
    const row = []; // Create an empty array for the current row

    // Loop through each column of the image
    for (let x = 0; x < width; x++) {
      // Calculate the index in the Uint8ClampedArray for the current pixel
      const index = (y * width + x) * 4;

      // Create an object representing the RGBA values of the current pixel
      const pixel: Pixel = {
        r: data[index], // Red component
        g: data[index + 1], // Green component
        b: data[index + 2], // Blue component
        a: data[index + 3], // Alpha component
      };

      // Add the pixel object to the current row
      row.push(pixel);
    }

    // Add the current row to the pixels array
    pixels.push(row);
  }

  // Return the 2D array of pixels
  return pixels;
}

/**
 * Calculates the width of a characters based on it's alpha values provided by `get2DImageData`
 * @param alphaValues The alpha values provded by `get2DImageData`
 * @returns The width of a character
 */
export function getCharWidth(alphaValues: Pixel[][], character: string) {
  // Space has a set value of 4
  if (character === " ") return 4;

  const lengths: number[] = [];

  for (const row of alphaValues) {
    let rowMaxX = 0;

    // Iterate from right to left
    for (let x = row.length - 1; x >= 0; x--) {
      const pixel = row[x];

      if (pixel && pixel.a && pixel.a > 0) {
        rowMaxX = x + 1;
        break; // Found the rightmost pixel, stop looking at this row
      }
    }
    lengths.push(rowMaxX);
  }

  // Handle empty alphaValues by providing 0 as a default to Math.max
  return lengths.length > 0 ? Math.max(...lengths) : 0;
}

/**
 * Calculates the dimensions of a 2D array or array of strings, ignoring specified characters.
 *
 * @param arr The 2D array or array of strings to measure.
 * @param ignores An array of characters (or any values) to ignore when calculating column lengths.
 * @returns An object containing the number of rows and the maximum number of columns.
 */
export function get2dArrayDimensions(arr: string[], ignores: string[]) {
  if (!Array.isArray(arr)) {
    throw new Error("Input must be an array.");
  }

  const rows = arr.length;

  if (rows === 0) {
    return { rows: 0, columns: 0 };
  }

  const charactersToIgnore = Array.isArray(ignores) ? ignores : [];

  const columns = arr.reduce((maxCols, currentRow) => {
    let effectiveRow;

    if (Array.isArray(currentRow)) {
      effectiveRow = currentRow;
    } else if (typeof currentRow === "string") {
      effectiveRow = Array.from(currentRow);
    } else {
      return maxCols;
    }

    const effectiveRowLength = effectiveRow.filter(
      (item) => !charactersToIgnore.includes(item),
    ).length;
    return Math.max(maxCols, effectiveRowLength);
  }, 0);

  return {
    rows: rows,
    columns: columns,
  };
}
