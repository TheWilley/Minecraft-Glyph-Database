export type TextureGlyph = {
  glyphs: Glyph[];
  textures: Texture[];
};

type Glyph = {
  base64Image: string;
  character: string;
  unicodeCode: string;
  characterWidth: number;
  fileName: string;
  gridLocation: number[];
};

type Texture = {
  base64Image: string;
  name: string;
};
