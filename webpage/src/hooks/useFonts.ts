import { useEffect, useState } from 'react';
import { Fonts, Json } from '../global/types';

/**
 * Custom hook for loading and organizing fonts from a JSON file.
 *
 * @returns An array containing the fonts object. The array is wrapped in a tuple to ensure immutability.
 */
export default function useFonts() {
  const [metadata, setMetadata] = useState<{
    timestamp: number;
    minecraftVersion: string;
  }>();
  const [fonts, setFonts] = useState<Fonts>();

  const extractedMetadata = (json: Json) => {
    return {
      timestamp: json.timestamp,
      minecraftVersion: json.minecraftVersion,
    };
  };

  /**
   * Extracts and organizes fonts from the given JSON data.
   *
   * @param {Json} json - The JSON data containing glyphs and textures.
   * @returns {Fonts} An object containing organized fonts with different categories.
   */
  const extractedFonts = (json: Json) => {
    const ascii = {
      glyphs: json.glyphs.filter((glyph) => glyph.fileName === 'ascii.png'),
      texture: json.textures[4],
    };
    const ascii_sga = {
      glyphs: json.glyphs.filter((glyph) => glyph.fileName === 'ascii_sga.png'),
      texture: json.textures[0],
    };
    const asciillager = {
      glyphs: json.glyphs.filter((glyph) => glyph.fileName === 'asciillager.png'),
      texture: json.textures[1],
    };
    const accented = {
      glyphs: json.glyphs.filter((glyph) => glyph.fileName === 'accented.png'),
      texture: json.textures[3],
    };
    const nonlatin_european = {
      glyphs: json.glyphs.filter((glyph) => glyph.fileName === 'nonlatin_european.png'),
      texture: json.textures[2],
    };

    return {
      ascii,
      ascii_sga,
      asciillager,
      accented,
      nonlatin_european,
    };
  };

  useEffect(() => {
    fetch('glyphs.json')
      .then((res) => res.json())
      .then((res) => {
        setFonts(extractedFonts(res));
        setMetadata(extractedMetadata(res));
      })
      .catch((_) => console.log(_));
  }, []);

  return [fonts, metadata] as const;
}
