export type TextureBuffer = {
  fileName: string;
  buffer: Buffer<ArrayBufferLike> | null;
};

export type Glyph = {
  base64Image: string; // Base 64 representation of the glyph
  character: string; // The character represented in UTF-8
  characterWidth: number; // The character width in pixels
  fileName: string; // From what file was the glyph derived
  gridLocation: { x: number; y: number }; // X and Y location of the glyph in the given texture
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

export type Texture = {
  name: string;
  size: { width: number; height: number };
  dimensions: { rows: number; columns: number };
  buffer: Buffer<ArrayBufferLike> | null;
  glyphs?: string[];
  chars?: string[];
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
