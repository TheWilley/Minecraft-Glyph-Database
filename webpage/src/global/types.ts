export type Json = {
  glyphs: Glyph[];
  textures: Texture[];
};

export type Fonts = {
  ascii: GlyphTexturePair;
  ascii_sga: GlyphTexturePair;
  asciillager: GlyphTexturePair;
  accented: GlyphTexturePair;
  nonlatin_european: GlyphTexturePair;
};

export type Texture = {
  base64Image: string;
  name: string;
  size: { x: number; y: number };
  dimensions: { x: number; y: number };
};

export type Glyph = {
  base64Image: string;
  character: string;
  unicodeCode: string;
  characterWidth: number;
  fileName: string;
  gridLocation: { y: number; x: number };
};

type GlyphTexturePair = { glyphs: Glyph[]; texture: Texture };
