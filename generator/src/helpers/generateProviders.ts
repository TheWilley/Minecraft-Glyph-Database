import { imageSize } from "image-size";
import type { Proivder, TextureBuffer } from "../global/types.js";
import { get2dArrayDimensions } from "./miscellaneousHelper.js";

/**
 * Generates a JSON array combining texture metadata and provider character data.
 * @param textures An array of texture objects containing file names, base64-encoded images, and buffers.
 * @param providers An object mapping names to provider data with type and character arrays.
 * @returns An array of combined objects including name, character grid, dimensions, size, and buffer.
 */
export function generateProviders(
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
