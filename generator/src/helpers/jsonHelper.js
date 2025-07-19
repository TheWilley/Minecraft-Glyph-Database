const fs = require("fs");
const { getRawCodePoints, splitIntoCharacters } = require("./unicodeHelper");
const { get2DImageData, getCharWidth } = require("./textureHelper");
const { createCanvas, loadImage } = require("canvas");
const { imageSize } = require('image-size');
const { get2dArrayDimensions } = require("./miscellaneousHelper");

/**
 * Generates an object containing glyph information
 * @param {*} texture An array entry representing a texture
 * @returns An object containing glyph information
 */
function generateGlyphObject(texture) {
  return new Promise((resolve) => {
    const charactersArray = texture.chars.map((character) =>
      splitIntoCharacters(character)
    );
    const canvasWidth = texture.size[0];
    const canvasHeight = texture.size[1];
    const columns = texture.dimensions[0];
    const rows = texture.dimensions[1];

    loadImage(texture.buffer).then((image) => {
      const glyphDataArray = [];

      // Define variables for cell dimensions
      const cellWidth = Math.floor(canvasWidth / columns);
      const cellHeight = Math.floor(canvasHeight / rows);
      const cellCanvas = createCanvas(cellWidth, cellHeight);
      const cellContext = cellCanvas.getContext("2d");
      cellContext.imageSmoothingEnabled = false;

      for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
          const character = charactersArray?.[rowIndex]?.[columnIndex];
          if (!character) continue;

          // Clear the cell canvas and draw the character
          cellContext.clearRect(0, 0, cellWidth, cellHeight);
          cellContext.drawImage(
            image,
            cellWidth * columnIndex,
            cellHeight * rowIndex,
            cellWidth,
            cellHeight,
            0,
            0,
            cellWidth,
            cellHeight
          );

          // Extract character information
          const imageData = get2DImageData(cellContext);
          const characterWidth = getCharWidth(imageData, character);
          const base64Image = cellCanvas.toDataURL("image/png");
          const fileName = texture.name + ".png";
          const unicodeCode = "U+" + getRawCodePoints(character);
          const gridLocation = { x: rowIndex, y: columnIndex };

          if (characterWidth > 0) {
            glyphDataArray.push({
              base64Image,
              character,
              characterWidth,
              fileName,
              gridLocation,
              unicodeCode,
            });
          }
        }
      }

      resolve(glyphDataArray);
    });
  });
}

/**
 * Generates an object containing texture information
 * @param {*} texture A texture object
 * @returns An object containing texture information
 */
function generateTextureObject(texture) {
  return new Promise((resolve) => {
    const canvas = createCanvas(texture.size[0], texture.size[1]);
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;

    loadImage(texture.image_path).then((image) => {
      context.drawImage(image, 0, 0);
      const base64Image = canvas.toDataURL("image/png");
      const textureData = {
        name: texture.name,
        base64Image,
        size: { x: texture.size[0], y: texture.size[1] },
        dimensions: { x: texture.dimensions[0], y: texture.dimensions[1] }
      };
      resolve(textureData);
    });
  });
}

/**
 * Generates a JSON array combining texture metadata and provider character data.
 *
 * @param {Array<{fileName: string, base64: string, buffer: Buffer}>} textures - 
 *   An array of texture objects containing file names, base64-encoded images, and buffers.
 * @param {Object<string, {providers: Array<{type: string, chars: string[][]}>}>} providers - 
 *   An object mapping names to provider data with type and character arrays.
 * @returns {Array<{
 *   name: string,
 *   chars: string[][],
 *   dimensions: [number, number],
 *   size: [number, number],
 *   buffer: Buffer
 * }>} An array of combined objects including name, character grid, dimensions, size, and buffer.
 */
function generateDocumentedJson(textures, providers) {
  const textureResults = [];

  // Getting image widths and heights
  for (const texture of textures) {
    try {
      const buffer = Buffer.from(texture.base64, 'base64');
      const dimensions = imageSize(buffer);

      textureResults.push({
        fileName: texture.fileName,
        width: dimensions.width,
        height: dimensions.height,
        buffer: texture.buffer,
      });
    } catch (err) {
      console.error(`Error reading image ${texture.fileName}: ${err.message}`);
    }
  }

  // Combining providers
  const finalResults = []

  for (const [key, value] of Object.entries(providers)) {
    const targetTexture = textureResults.find(textureResult => textureResult.fileName.replace('.png', '' === key))
    const targetProvider = value.providers.find(provider => provider.type === 'bitmap')

    if (targetProvider) {
      const combinedObj = {
        name: key,
        chars: targetProvider.chars,
        dimensions: [get2dArrayDimensions(targetProvider.chars)],
        size: [targetTexture.width, targetTexture.height],
        buffer: targetTexture.buffer,
      }

      finalResults.push(combinedObj)
    }
  }

  return finalResults;
}

/**
 * Generates a JSON file from texture and provider data, including glyph and texture objects.
 *
 * Processes the given textures and providers to produce documented JSON,
 * then generates glyph and texture objects asynchronously, and finally
 * writes the combined data to a JSON file.
 *
 * @param {string} outputFileName The name of the generated JSON file (without extension).
 * @param {string} version The Minecraft version string to include in the output.
 * @param {Array} textures Array of texture data objects to process.
 * @param {Object} providers Object containing provider data for textures.
 * @returns {Promise<void>} A promise that resolves when the file has been written.
 */
async function createJson(outputFileName, version, textures, providers) {
  const texturesJson = generateDocumentedJson(textures, providers)

  const generatedTextures = [];
  const generatedGlyphs = [];

  for (const texture of texturesJson) {
    const glyphObject = await generateGlyphObject(texture);
    const textureObject = await generateTextureObject(texture);
    generatedGlyphs.push(glyphObject);
    generatedTextures.push(textureObject);
  }

  const outputData = {
    timestamp: Date.now(),
    minecraftVersion: version,
    textures: generatedTextures.flat(),
    glyphs: generatedGlyphs.flat(),
  };

  fs.writeFileSync("../dist/" + outputFileName + ".json", JSON.stringify(outputData));
}

module.exports = createJson;
