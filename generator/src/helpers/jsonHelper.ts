import type { Proivder, TextureBuffer } from "../global/types.js";

import fs from "fs";
import { imageSize } from "image-size";
import { get2dArrayDimensions } from "./miscellaneousHelper.js";
import { generateGlyphObject } from "./generateGlyphObject.js";
import path from "path";
import { generateTextureObject } from "./generateTextureObject.js";
import { generateProviders } from "./generateProviders.js";

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
      if (glyphs.ok === false || textureMetadata.ok === false) {
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
