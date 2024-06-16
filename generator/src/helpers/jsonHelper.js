const fs = require("fs");
const {
  getRawCodePoints,
  splitIntoCharacters,
} = require("./unicodeHelper");
const { get2DImageData, getCharWidth } = require("./textureHelper");
const { createCanvas, loadImage } = require("canvas");

/**
 * Generates a object containing glyph info
 * @param {*} item An array entry
 * @returns A object containing glyph info
 */
function generateGlyphData(item) {
  return new Promise((resolve) => {
    const characters = item.chars.map((character) => splitIntoCharacters(character));
    const canvasWidth = item.size[0];
    const canvasHeight = item.size[1];
    const cells = item.dimensions[0];
    const rows = item.dimensions[1];

    loadImage(item.image_path).then((image) => {
      const widths = [];

      // Define variables for cells
      const cellWidth = Math.floor(canvasWidth / cells);
      const cellHeight = Math.floor(canvasHeight / rows);
      const cellCanvas = createCanvas(cellWidth, cellHeight);
      const cellCtx = cellCanvas.getContext("2d");
      cellCtx.imageSmoothingEnabled = false;

      for (let row = 0; row <= rows; row++) {
        for (let cell = 0; cell <= cells; cell++) {
          const character = characters?.[row]?.[cell];
          if (!character) continue;

          // Mask character
          cellCtx.clearRect(0, 0, cellWidth, cellHeight);
          cellCtx.drawImage(
            image,
            cellWidth * cell,
            cellHeight * row,
            cellWidth,
            cellHeight,
            0,
            0,
            cellWidth,
            cellHeight
          );

          // Info
          const data = get2DImageData(cellCtx);
          const width = getCharWidth(data, character);
          const base64 = cellCanvas.toDataURL("image/png");
          const file = item.name + ".png";
          const unicode = "U+" + getRawCodePoints(character);
          const location = [row, cell];

          if (width > 0) {
            widths.push({ base64, character, width, file, location, unicode });
          }
        }
      }

      resolve(widths);
    });
  });
}

/**
 * Generates JSON from `textures.json`
 * @param {*} name The generated JSON file name
 */
async function createJson(name) {
  const json = readJson("./textures.json");
  const parsed = JSON.parse(json);

  const glyphs = [];
  for (const item of parsed) {
    const glyph = await generateGlyphData(item);
    glyphs.push(glyph);
  }
  fs.writeFileSync("../dist/" + name + ".json", JSON.stringify(glyphs.flat()));
}

/**
 * Reads a JSON file from path
 * @param {*} path The path to a JSON file
 * @returns The contents of the JSON file
 */
function readJson(path) {
  const data = fs.readFileSync(path);
  if (data) return data;
}

module.exports = createJson;
