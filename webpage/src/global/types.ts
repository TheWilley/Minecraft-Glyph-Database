export type Json = {
  timestamp: number;
  minecraftVersion: string;
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
  base64: string;
  name: string;
  size: { width: number; height: number };
  dimensions: { rows: number; columns: number };
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
