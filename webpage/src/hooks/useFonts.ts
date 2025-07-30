import { useEffect, useState } from 'react';
import { Fonts, Json } from '../global/types'; // Assuming Fonts and Json types are defined here

/**
 * Custom hook for loading and organizing fonts from a JSON file.
 *
 * @returns An array containing the fonts object and metadata. The array is wrapped in a tuple to ensure immutability.
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
   * Ensures that all required textures are found, otherwise returns null.
   *
   * @param {Json} json - The JSON data containing glyphs and textures.
   * @returns {Fonts | null} An object containing organized fonts with different categories, or null if a texture is missing.
   */
  const extractFonts = (json: Json): Fonts | null => {
    // <--- Modified return type
    const asciiTexture = json.textures.find((texture) => texture.name === 'ascii');
    if (!asciiTexture) {
      console.error('Missing \'ascii\' texture.');
      return null;
    }
    const ascii = {
      glyphs: json.glyphs.filter((glyph) => glyph.fileName === 'ascii.png'),
      texture: asciiTexture,
    };

    const ascii_sgaTexture = json.textures.find(
      (texture) => texture.name === 'ascii_sga'
    );
    if (!ascii_sgaTexture) {
      console.error('Missing \'ascii_sga\' texture.');
      return null;
    }
    const ascii_sga = {
      glyphs: json.glyphs.filter((glyph) => glyph.fileName === 'ascii_sga.png'),
      texture: ascii_sgaTexture,
    };

    const asciillagerTexture = json.textures.find(
      (texture) => texture.name === 'asciillager'
    );
    if (!asciillagerTexture) {
      console.error('Missing \'asciillager\' texture.');
      return null;
    }
    const asciillager = {
      glyphs: json.glyphs.filter((glyph) => glyph.fileName === 'asciillager.png'),
      texture: asciillagerTexture,
    };

    const accentedTexture = json.textures.find((texture) => texture.name === 'accented');
    if (!accentedTexture) {
      console.error('Missing \'accented\' texture.');
      return null;
    }
    const accented = {
      glyphs: json.glyphs.filter((glyph) => glyph.fileName === 'accented.png'),
      texture: accentedTexture,
    };

    const nonlatin_europeanTexture = json.textures.find(
      (texture) => texture.name === 'nonlatin_european'
    );
    if (!nonlatin_europeanTexture) {
      console.error('Missing \'nonlatin_european\' texture.');
      return null;
    }
    const nonlatin_european = {
      glyphs: json.glyphs.filter((glyph) => glyph.fileName === 'nonlatin_european.png'),
      texture: nonlatin_europeanTexture,
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
        const extractedFonts = extractFonts(res);
        if (extractedFonts) {
          setFonts(extractedFonts);
          setMetadata(extractedMetadata(res));
        } else {
          console.error('Failed to load all required font textures. Font data not set.');
        }
      })
      .catch((error) => {
        console.error('Error fetching or parsing glyphs.json:', error);
      });
  }, []);

  return [fonts, metadata] as const;
}
