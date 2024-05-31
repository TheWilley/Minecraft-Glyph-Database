const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const commandLineArgs = require("command-line-args");
const path = require("path");
const AdmZip = require("adm-zip");

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
 * @param {number[]} pixels The alpha values provded by `get2DImageData`
 * @returns The width of a character
 */
function getCharWidth(pixels, character) {
  // Edge case for spaces
  if (character === " ") return 4;

  // Calculate based on the most right pixel with an alpha above 0
  const lengths = [];
  for (let y = 0; y < pixels.length; y++) {
    let lastAlpha = 0;
    for (let x = 0; x < pixels[y].length; x++) {
      if (pixels[y][x].a > 0) lastAlpha = x + 1;
    }
    lengths.push(lastAlpha);
  }
  const final = Math.max(...lengths);
  return final;
}

/**
 * Generates a object containing glyph info
 * @param {*} item An array entry
 * @returns A object containing glyph info
 */
function generateGlyphData(item) {
  return new Promise((resolve) => {
    const chars = item.chars.map((char) => char.split(""));
    const width = item.size[0];
    const height = item.size[1];
    const cells = item.dimensions[0];
    const rows = item.dimensions[1];

    loadImage(item.image_path).then((image) => {
      const widths = [];

      // Define variables for cells
      const cellWidth = Math.floor(width / cells);
      const cellHeight = Math.floor(height / rows);
      const cellCanvas = createCanvas(cellWidth, cellHeight);
      const cellCtx = cellCanvas.getContext("2d");
      cellCtx.imageSmoothingEnabled = false;

      for (let row = 0; row <= rows; row++) {
        for (let cell = 0; cell <= cells; cell++) {
          const character = chars?.[row]?.[cell];
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
          const unicode =
            "U+" + character.charCodeAt(0).toString(16).toUpperCase();
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
 * @param {*} json The `textures.json` file
 * @param {*} name The generated JSON file name
 */
async function createJson(json, name) {
  const glyphs = [];
  for (const item of json) {
    const glyph = await generateGlyphData(item);
    glyphs.push(glyph);
  }
  fs.writeFileSync("./" + name + ".json", JSON.stringify(glyphs.flat()));
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

/**
 * Checks if string is a valid x.x.x version format
 * @param {*} version The string to check
 * @returns Wether the string follows the format
 */
function isValidVersion(version) {
  // Ensure the version matches the x.x.x format
  const regex = /^\d+\.\d+\.\d+$/;
  return regex.test(version);
}

/**
 * Compares two versions in the x.x.x format
 * @param {*} version1 The first string
 * @param {*} version2 The second string
 * @returns Wether the first version is larger than the second
 */
function compareVersions(version1, version2) {
  const v1 = version1.split(".").map(Number);
  const v2 = version2.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (v1[i] > v2[i]) return 1;
    if (v1[i] < v2[i]) return -1;
  }
  return 0;
}

/**
 * Finds the newest version in an array of strings
 * @param {*} versions An array of strings
 * @returns The newest version
 */
function findNewestVersion(versions) {
  // Filter out invalid versions
  const validVersions = versions.filter(isValidVersion);

  // If no valid versions, return null or a message
  if (validVersions.length === 0) {
    return null;
  }

  return validVersions.reduce((newest, current) => {
    return compareVersions(newest, current) > 0 ? newest : current;
  });
}

/**
 * Extract font specific textures from a Minecraft version 
 * @param {*} jarFilePath The path to the Miencraft version `.jar` file
 * @param {*} folderPath The path to the assets within the `.jar` file
 * @param {*} outputDir The output directory to extract assets to
 */
function extractTexturesFromJJar(jarFilePath, folderPath, outputDir) {
  try {
    const zip = new AdmZip(jarFilePath);
    const zipEntries = zip.getEntries();

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    zipEntries.forEach((entry) => {
      // Check if the entry is within the specified folder
      if (entry.entryName.startsWith(folderPath) && !entry.isDirectory) {
        const fileName = path.basename(entry.entryName);
        const fileOutputPath = path.join(outputDir, fileName);

        // Extract the file
        fs.writeFileSync(fileOutputPath, zip.readFile(entry));
        console.info(`Extracted: ${fileOutputPath}`);
      }
    });
  } catch (err) {
    console.error(`Error extracting folder from JAR file: ${err}`);
  }
}

/**
 * Gets textures from Minecraft source
 * @param {*} path The path to the Minecraft game folder
 */
function getTexturesFromMinecraft(path) {
  const versionsPath = path + "/versions";
  if (fs.existsSync(versionsPath)) {
    const versions = fs.readdirSync(versionsPath);
    const newest = findNewestVersion(versions);

    const newestVersionPath =
      versionsPath + "/" + newest + "/" + newest + ".jar";
    extractTexturesFromJJar(
      newestVersionPath,
      "assets/minecraft/textures/font",
      "textures"
    );
  } else {
    console.error('error: "versions" folder not found, is the path correct?');
  }
}

/**
 * The primary function
 * @param {*} path The path to the game folder
 * @param {*} name The name of the output JSON
 * @param {*} skip If we shouldn't extract textures automatically
 */
function main(path, name, skip) {
  if (!skip) getTexturesFromMinecraft(path);
  const json = readJson("./textures.json");
  const parsed = JSON.parse(json);
  createJson(parsed, name);
}

const optionDefinitions = [
  { name: "path", type: String, defaultOption: true },
  { name: "name", type: String },
  { name: "skip", type: Boolean },
];
const options = commandLineArgs(optionDefinitions);
main(options.path, options.name, options.skip);
