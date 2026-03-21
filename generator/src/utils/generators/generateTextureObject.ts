import type { Result, DecodedTexture, Texture } from "../../global/types.js";
import { Canvas, loadImage } from "skia-canvas";

export async function encodeTexture(
  texture: DecodedTexture,
): Promise<Result<Texture, string>> {
  const canvas = new Canvas(
    texture.resolution.width,
    texture.resolution.height,
  );
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;

  if (!texture.buffer) {
    return { ok: false, error: "Texture buffer empty" };
  }

  const image = await loadImage(texture.buffer);
  context.drawImage(image, 0, 0);
  const base64 = canvas.toDataURL("png");
  const textureData: Texture = {
    name: texture.name,
    chars: texture.chars,
    grid: texture.grid,
    resolution: texture.resolution,
    base64,
  };
  return { ok: true, value: textureData };
}
