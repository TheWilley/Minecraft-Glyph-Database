export type TextureBuffer = {
  fileName: string;
  buffer: Buffer<ArrayBufferLike> | null;
};

export type Glyph = {
  base64: string; // Base 64 representation of the glyph
  character: string; // The character represented in UTF-8
  characterWidth: number; // The character width in pixels
  fileName: string; // From what file was the glyph derived
  coordinates: Coordinates; // X and Y location of the glyph in the given texture
  unicodeCode: string; // The character represented in unicode
};

export type Proivder = {
  type: string;
  file: string;
  height: number;
  ascent: number;
  chars: string[];
  name: string;
};

export type Pixel = {
  r: number | undefined;
  g: number | undefined;
  b: number | undefined;
  a: number | undefined;
};

export interface FinalOutput {
  timestamp: number;
  minecraftVersion: string;
  textures: Success<Texture>[];
  glyphs: Success<Glyph[]>[];
}

export interface Resolution {
  width: number;
  height: number;
}

export interface Grid {
  rows: number;
  columns: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface TextureSource {
  fileName: string;
  buffer: Buffer<ArrayBufferLike> | null;
}

export interface DecodedTexture {
  name: string;
  chars: string[];
  grid: Grid;
  resolution: Resolution;
  buffer: Uint8Array;
}

export type Texture = Omit<DecodedTexture, "buffer"> & {
  base64: string;
};

type Success<T> = {
  ok: true;
  value: T;
};

type Failure<E> = {
  ok: false;
  error: E;
};

export type Result<T, E = Error> = Success<T> | Failure<E>;
