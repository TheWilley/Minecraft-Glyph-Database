import { useEffect, useState } from 'react';
import { ConvertedData, Glyph } from '../global/types';

export default function useTable(
  data: ConvertedData,
  textureKey: keyof ConvertedData,
  query: string
) {
  const [highlightedArea, setHighlightedArea] = useState<{ x: number; y: number }>({
    x: -1,
    y: -1,
  });
  const [filteredData, setFilteredData] = useState<Glyph[]>();
  const [disableHighlightChange, setDisableHighlightChange] = useState(false);
  const [scrolledToGlyphOnInit, setScrolledToGlyphOnInit] = useState(false);

  const handleHoverChange = (x: number, y: number) => {
    if (!disableHighlightChange) {
      setHighlightedArea({ x, y });
    }
  };

  const resetHighlitedArea = (skipCheck?: boolean) => {
    if (!disableHighlightChange || skipCheck === true) {
      setHighlightedArea({ x: -1, y: -1 });
    }
  };

  useEffect(() => {
    // Extract the hash part of the URL (e.g., '#U+4C')
    const hash = location.hash;

    if (hash && !scrolledToGlyphOnInit) {
      // Remove the '#' character and scroll to the element with the corresponding ID
      const id = hash.replace('#', '');
      scrollTo(id);
    }
  }, [filteredData, scrolledToGlyphOnInit]);

  const scrollTo = (id: string) => {
    // Go to the target
    location.href = '#' + id;

    // Get the element and set offset
    const element = document.getElementById(id);
    const headerOffset = 100;

    // Try to navigate to the element
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setScrolledToGlyphOnInit(true);
    }
  };

  useEffect(() => {
    if (query) {
      const result = data[textureKey].glyphs.filter((item) => item.character === query);
      setFilteredData(result);

      // This works, but I really need to check coordinate variables because this makes no sense
      if (result.length)
        setHighlightedArea({ x: result[0].gridLocation.y, y: result[0].gridLocation.x });
      setDisableHighlightChange(true);
    } else {
      setFilteredData(data[textureKey].glyphs);
      setDisableHighlightChange(false);
      resetHighlitedArea(true);
    }
  }, [data, textureKey, query]);

  return {
    highlightedArea,
    filteredData,
    handleHoverChange,
    resetHighlitedArea,
    scrollTo,
  };
}
