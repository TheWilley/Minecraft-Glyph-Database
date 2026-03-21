import { imageSize } from "image-size";
import type {
  Proivder,
  Result,
  TextureSource,
  DecodedTexture,
  Resolution,
} from "../../global/types.js";
import { get2dArrayDimensions } from "../textureUtils.js";

/**
 * Generates a JSON array combining texture metadata and provider character data.
 * @param textureSources An array of texture objects containing file names, base64-encoded images, and buffers.
 * @param providers An object mapping names to provider data with type and character arrays.
 * @returns An array of combined objects including name, character grid, dimensions, size, and buffer.
 */
export function createDecodedTextures(
  textureSources: TextureSource[],
  providers: Proivder[],
): Result<DecodedTexture[], string> {
  const textureMap = new Map<
    string,
    { buffer: Uint8Array; size: Resolution }
  >();

  for (const tex of textureSources) {
    try {
      if (tex.buffer) {
        const dimensions = imageSize(tex.buffer);
        const key = tex.fileName.replace(".png", "");

        textureMap.set(key, {
          buffer: tex.buffer,
          size: { width: dimensions.width, height: dimensions.height },
        });
      }
    } catch (err) {
      return {
        ok: false,
        error: `Could not read image ${tex.fileName}: ${(err as Error).message}`,
      };
    }
  }

  // Combine with Providers
  const finalResults: DecodedTexture[] = [];

  for (const provider of providers) {
    const asset = textureMap.get(provider.name);

    if (asset) {
      finalResults.push({
        name: provider.name,
        chars: provider.chars,
        grid: get2dArrayDimensions(provider.chars, ["\ud800"]),
        resolution: asset.size,
        buffer: asset.buffer,
      });
    }
  }

  return { ok: true, value: finalResults };
}
