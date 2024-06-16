/**
 * Converts the image data from a canvas context into a 2D array of RGBA values.
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @returns {Array} A 2D array where each element is an object with r, g, b, and a properties.
 */
function get2DImageData(ctx) {
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
      const pixel = {
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
 * @param {number[]} alphaValues The alpha values provded by `get2DImageData`
 * @returns The width of a character
 */
function getCharWidth(alphaValues, character) {
  // Edge case for spaces
  if (character === " ") return 4;

  // Calculate based on the most right pixel with an alpha above 0
  const lengths = [];
  for (let y = 0; y < alphaValues.length; y++) {
    let lastAlphaValue = 0;
    for (let x = 0; x < alphaValues[y].length; x++) {
      if (alphaValues[y][x].a > 0) lastAlphaValue = x + 1;
    }
    lengths.push(lastAlphaValue);
  }
  const final = Math.max(...lengths);
  return final;
}

module.exports = { get2DImageData, getCharWidth };
