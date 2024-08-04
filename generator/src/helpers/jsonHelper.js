const fs = require("fs");
const { getRawCodePoints, splitIntoCharacters } = require("./unicodeHelper");
const { get2DImageData, getCharWidth } = require("./textureHelper");
const { createCanvas, loadImage } = require("canvas");

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

    loadImage(texture.image_path).then((image) => {
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
 * Generates JSON from `textures.json`
 * @param {*} outputFileName The name of the generated JSON file
 */
async function createJson(outputFileName) {
  const texturesJson = readJson("./textures.json");
  const texturesArray = JSON.parse(texturesJson);

  const textures = [];
  const glyphs = [];

  for (const texture of texturesArray) {
    const glyphObject = await generateGlyphObject(texture);
    const textureObject = await generateTextureObject(texture);
    glyphs.push(glyphObject);
    textures.push(textureObject);
  }

  const outputData = {
    textures: textures.flat(),
    glyphs: glyphs.flat(),
  };

  fs.writeFileSync("../dist/" + outputFileName + ".json", JSON.stringify(outputData));
}

/**
 * Reads a JSON file from the given path
 * @param {*} filePath The path to a JSON file
 * @returns The contents of the JSON file
 */
function readJson(filePath) {
  const fileData = fs.readFileSync(filePath);
  if (fileData) return fileData;
}

module.exports = createJson;
