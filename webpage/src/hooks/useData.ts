import { useEffect, useState } from 'react';
import { ConvertedData, TextureGlyph } from '../global/types';

export default function useData() {
  const [data, setData] = useState<ConvertedData>();

  const convertData = (data: TextureGlyph) => {
    const ascii = {
      glyphs: data.glyphs.filter((glyph) => glyph.fileName === 'ascii.png'),
      texture: data.textures[0],
    };
    const ascii_sga = {
      glyphs: data.glyphs.filter((glyph) => glyph.fileName === 'ascii_sga.png'),
      texture: data.textures[1],
    };
    const asciillager = {
      glyphs: data.glyphs.filter((glyph) => glyph.fileName === 'asciillager.png'),
      texture: data.textures[2],
    };
    const accented = {
      glyphs: data.glyphs.filter((glyph) => glyph.fileName === 'accented.png'),
      texture: data.textures[3],
    };
    const nonlatin_european = {
      glyphs: data.glyphs.filter((glyph) => glyph.fileName === 'nonlatin_european.png'),
      texture: data.textures[4],
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
        setData(convertData(res));
      })
      .catch((_) => console.log(_));
  }, []);

  return [data] as const;
}
