import { useEffect, useState } from 'react';
import { Glyph } from '../global/types';

export default function useData() {
  const [data, setData] = useState<Glyph[]>();

  useEffect(() => {
    fetch('glyphs.json')
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      })
      .catch((_) => console.log(_));
  }, []);

  return [data] as const;
}
