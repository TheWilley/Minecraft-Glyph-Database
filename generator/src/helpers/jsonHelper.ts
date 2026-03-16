import type {
  Glyph,
  Proivder,
  Texture,
  TextureBuffer,
} from "../global/types.js";

import fs from "fs";
import { getRawCodePoints, splitIntoCharacters } from "./unicodeHelper.js";
import { get2DImageData, getCharWidth } from "./textureHelper.js";
import { createCanvas, loadImage } from "canvas";
import { imageSize } from "image-size";
import { get2dArrayDimensions } from "./miscellaneousHelper.js";

/**
 * Generates an object containing glyph information
 * @param texture An array entry representing a texture
 * @returns An object containing glyph information
 */
function generateGlyphObject(texture: Texture) {
  return new Promise((resolve) => {
    if (!texture.chars) return;
    const charactersArray = texture.chars.map((character) =>
      splitIntoCharacters(character),
    );
    const canvasWidth = texture.size.width;
    const canvasHeight = texture.size.height;
    const columns = texture.dimensions.columns;
    const rows = texture.dimensions.rows;

    if (!texture.buffer) {
      return;
    }

    loadImage(texture.buffer).then((image) => {
      const glyphDataArray: Glyph[] = [];

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
            cellHeight,
          );

          // Extract character information
          // Weird bug here, will solve later
          //@ts-ignore
          const imageData = get2DImageData(cellContext);
          const characterWidth = getCharWidth(imageData, character);
          const base64Image = cellCanvas.toDataURL("image/png");
          const fileName = texture.name + ".png";
          const unicodeCode = "U+" + getRawCodePoints(character);
          const gridLocation = { y: rowIndex, x: columnIndex };

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
 * @param texture A texture object
 * @returns An object containing texture information
 */
function generateTextureObject(texture: Texture) {
  return new Promise((resolve) => {
    const canvas = createCanvas(texture.size.width, texture.size.height);
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;

    if (!texture.buffer) {
      return;
    }

    loadImage(texture.buffer).then((image) => {
      context.drawImage(image, 0, 0);
      const base64 = canvas.toDataURL("image/png");
      const textureData = {
        name: texture.name,
        base64,
        size: { width: texture.size.width, height: texture.size.height },
        dimensions: {
          columns: texture.dimensions.columns,
          rows: texture.dimensions.rows,
        },
      };
      resolve(textureData);
    });
  });
}

/**
 * Generates a JSON array combining texture metadata and provider character data.
 * @param textures An array of texture objects containing file names, base64-encoded images, and buffers.
 * @param providers An object mapping names to provider data with type and character arrays.
 * @returns An array of combined objects including name, character grid, dimensions, size, and buffer.
 */
function generateDocumentedJson(
  textures: TextureBuffer[],
  providers: Proivder[],
) {
  const textureResults = [];

  // Getting image widths and heights
  for (const texture of textures) {
    try {
      const buffer = texture.buffer as Uint8Array<ArrayBufferLike>;
      const dimensions = imageSize(buffer);

      textureResults.push({
        fileName: texture.fileName,
        width: dimensions.width,
        height: dimensions.height,
        buffer: texture.buffer,
      });
    } catch (err) {
      console.error(
        `Error reading image ${texture.fileName}: ${(err as Error).message}`,
      );
    }
  }

  // Combining providers
  const finalResults = [];

  for (const provider of providers) {
    const targetTexture = textureResults.find(
      (textureResult) =>
        textureResult.fileName.replace(".png", "") === provider.name,
    );

    if (targetTexture) {
      const combinedObj = {
        name: provider.name,
        chars: provider.chars,
        dimensions: get2dArrayDimensions(provider.chars, ["\ud800"]),
        size: { width: targetTexture.width, height: targetTexture.height },
        buffer: targetTexture.buffer,
      };

      finalResults.push(combinedObj);
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
 * @param version The Minecraft version string to include in the output.
 * @param textures Array of texture data objects to process.
 * @param providers Object containing provider data for textures.
 * @returns A promise that resolves when the file has been written.
 */
export async function createJson(
  version: string,
  textures: TextureBuffer[],
  providers: Proivder[],
) {
  const texturesJson = generateDocumentedJson(textures, providers);

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

  fs.writeFileSync("./dist/" + "glyphs.json", JSON.stringify(outputData));
}
