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
import { generateGlyphObject } from "./generateGlyphObject.js";
import path from "path";

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
function generateProviders(textures: TextureBuffer[], providers: Proivder[]) {
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
  const texturesJson = generateProviders(textures, providers);

  if (!texturesJson.length) {
    console.warn("No textures found to process.");
    return;
  }

  // We process textures in parallel for better performance
  const results = await Promise.all(
    texturesJson.map(async (texture) => {
      const [glyphs, textureMetadata] = await Promise.all([
        generateGlyphObject(texture),
        generateTextureObject(texture),
      ]);

      // Handle results
      if (glyphs.ok === false) {
        return null;
      }

      return { glyphs, textureMetadata };
    }),
  );

  // We filter out all "failed" (null) glyphs
  const successfulResults = results.filter(
    (r): r is NonNullable<typeof r> => r !== null,
  );

  // Flatten the results into the final structure
  const outputData = {
    timestamp: Date.now(),
    minecraftVersion: version,
    textures: successfulResults.flatMap((r) => r.textureMetadata),
    glyphs: successfulResults.flatMap((r) => r.glyphs),
  };

  // Ensure distribution directory exists
  const distPath = "./dist";
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }

  const outputPath = path.join(distPath, "glyphs.json");

  fs.writeFileSync(outputPath, JSON.stringify(outputData));
}
