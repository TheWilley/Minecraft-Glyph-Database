import type { Result, Texture, TextureJson } from "../../global/types.js";
import { Canvas, loadImage } from "skia-canvas";

export async function generateTextureObject(
  texture: Texture,
): Promise<Result<TextureJson, string>> {
  const canvas = new Canvas(texture.size.width, texture.size.height);
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;

  if (!texture.buffer) {
    return { ok: false, error: "Texture buffer empty" };
  }

  const image = await loadImage(texture.buffer);
  context.drawImage(image, 0, 0);
  const base64 = canvas.toDataURL("png");
  const textureData = {
    name: texture.name,
    base64,
    size: { width: texture.size.width, height: texture.size.height },
    dimensions: {
      columns: texture.dimensions.columns,
      rows: texture.dimensions.rows,
    },
  };
  return { ok: true, value: textureData };
}
