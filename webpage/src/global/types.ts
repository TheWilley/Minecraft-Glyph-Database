export type TextureGlyph = {
  glyphs: Glyph[];
  textures: Texture[];
};

export type ConvertedData = {
  ascii: GlyphTexturePair;
  ascii_sga: GlyphTexturePair;
  asciillager: GlyphTexturePair;
  accented: GlyphTexturePair;
  nonlatin_european: GlyphTexturePair;
}

export type Texture = {
  base64Image: string;
  name: string;
  size: number[];
  dimensions: number[];
};

type GlyphTexturePair = { glyphs: Glyph[], texture: Texture }

type Glyph = {
  base64Image: string;
  character: string;
  unicodeCode: string;
  characterWidth: number;
  fileName: string;
  gridLocation: number[];
};

