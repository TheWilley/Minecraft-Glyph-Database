import type {
  MinecraftGlyphDatabaseOutput,
  Proivder,
  Result,
  Text2BookOutput,
  TextureSource,
} from "../global/types.js";

import fs from "fs";
import { encodeGlyphs } from "./generators/generateGlyphObject.js";
import path from "path";
import { encodeTexture } from "./generators/generateTextureObject.js";
import { createDecodedTextures } from "./generators/generateProviders.js";

/**
 * Generates a JSON file from texture and provider data, including glyph and texture objects.
 *
 * Processes the given textures and providers to produce documented JSON,
 * then generates glyph and texture objects asynchronously, and finally
 * writes the combined data to a JSON file.
 *
 * @param version The Minecraft version string to include in the output.
 * @param textureSources Array of texture data objects to process.
 * @param providers Object containing provider data for textures.
 * @returns A promise that resolves when the file has been written.
 */
export async function createJson(
  version: string,
  textureSources: TextureSource[],
  providers: Proivder[],
  text2bookReady: boolean,
): Promise<Result<string, string>> {
  const decodedTextures = createDecodedTextures(textureSources, providers);

  if (!decodedTextures.ok) {
    return { ok: false, error: decodedTextures.error };
  }

  if (!decodedTextures.value.length) {
    return { ok: false, error: "No textures found to process." };
  }

  // We process textures in parallel for better performance
  // Combine glyphs and textures into a single object
  // using the previosly created Texture object
  const textureGlyphPairs = await Promise.all(
    decodedTextures.value.map(async (texture) => {
      const [glyphs, textureMetadata] = await Promise.all([
        encodeGlyphs(texture),
        encodeTexture(texture),
      ]);

      // Handle results
      if (glyphs.ok === false || textureMetadata.ok === false) {
        return null;
      }

      return { glyphs, textureMetadata };
    }),
  );

  // We filter out all "failed" (null) pairs
  const definedPairs = textureGlyphPairs.filter(
    (r): r is NonNullable<typeof r> => r !== null,
  );

  let output: MinecraftGlyphDatabaseOutput | Text2BookOutput;

  // We're writing for Text2Book
  if (text2bookReady) {
    output = definedPairs
      .flatMap((r) => r.glyphs.value)
      .map((glyph) => ({
        char: glyph.character,
        pixels: glyph.characterWidth,
      }));
  } else {
    // We're writing for MinecraftGlyphDatabase
    output = {
      timestamp: Date.now(),
      minecraftVersion: version,
      textures: definedPairs.flatMap((r) => r.textureMetadata.value),
      glyphs: definedPairs.flatMap((r) => r.glyphs.value),
    };
  }

  // Ensure distribution directory exists
  const distPath = "./dist";
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }

  const outputPath = path.join(distPath, "glyphs.json");
  fs.writeFileSync(outputPath, JSON.stringify(output));

  return { ok: true, value: outputPath };
}
