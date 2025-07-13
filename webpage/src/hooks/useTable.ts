import { useEffect, useState } from 'react';
import { Fonts, Glyph } from '../global/types';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Custom hook for managing font glyphs in a table, including highlighting and filtering.
 *
 * @param fonts - The collection of fonts, indexed by font key.
 * @param fontKey - The key for the specific font in the fonts collection.
 * @param query - The search query to filter glyphs.
 */
export default function useTable(
  fonts: Fonts | undefined,
  fontKey: keyof Fonts,
  query: string
) {
  const [highlightedArea, setHighlightedArea] = useState<{ x: number; y: number }>({
    x: -1,
    y: -1,
  });
  const [filteredFonts, setFilteredFonts] = useState<Glyph[]>();
  const [disableHighlightChange, setDisableHighlightChange] = useState(false);
  const [scrolledToGlyphOnInit, setScrolledToGlyphOnInit] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    const hash = location.hash;

    if (hash && !scrolledToGlyphOnInit) {
      const id = hash.replace('#', '');
      scrollTo(id);
    }
  }, [filteredFonts, location.hash, scrolledToGlyphOnInit]);

  const scrollTo = (id: string) => {
    navigate(`#${id}`);
    const element = document.getElementById(id);
    const headerOffset = 100;

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
    if (fonts) {
      if (query) {
        // Only get character from query
        const result = fonts[fontKey].glyphs.filter((item) => item.character === query);
        setFilteredFonts(result);

        // This works, but I really need to check coordinate variables because this makes no sense
        // Ideally x and y should be reversed here, but I'll keep it for now
        if (result.length)
          setHighlightedArea({
            x: result[0].gridLocation.y,
            y: result[0].gridLocation.x,
          });
        setDisableHighlightChange(true);
      } else {
        setFilteredFonts(fonts[fontKey].glyphs);
        setDisableHighlightChange(false);
        resetHighlitedArea(true);
      }
    }
  }, [fonts, fontKey, query]);

  return {
    highlightedArea,
    filteredFonts,
    handleHoverChange,
    resetHighlitedArea,
    scrollTo,
  };
}
