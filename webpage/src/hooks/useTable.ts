import { useCallback, useEffect, useRef, useState } from 'react';
import { Fonts, Glyph } from '../global/types';
import { useLocation, useNavigate } from 'react-router-dom';

export default function useTable(
  fonts: Fonts | undefined,
  fontKey: keyof Fonts,
  query: string
) {
  const [highlightedArea, setHighlightedArea] = useState({ x: -1, y: -1 });
  const [filteredFonts, setFilteredFonts] = useState<Glyph[]>();
  const [disableHighlightChange, setDisableHighlightChange] = useState(false);
  const [hash, setHash] = useState<string | null>('');
  const [noQueryMatch, setNoQueryMatch] = useState(false);
  const [queryMatches, setQueryMatches] = useState<string[]>();

  const hasScrolledToGlyph = useRef(false);
  const previousQuery = useRef('');

  const location = useLocation();
  const navigate = useNavigate();

  const handleHoverChange = (x: number, y: number) => {
    if (!disableHighlightChange) {
      setHighlightedArea({ x, y });
    }
  };

  const resetHighlightedArea = useCallback(
    (forceReset = false) => {
      if (!disableHighlightChange || forceReset) {
        setHighlightedArea({ x: -1, y: -1 });
      }
    },
    [disableHighlightChange]
  );

  const scrollTo = useCallback(
    (id: string) => {
      navigate(`#${id}`);
      setHash(id);

      const element = document.getElementById(id);
      const offset = 100;

      if (element) {
        const top = element.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top,
          behavior: 'smooth',
        });

        hasScrolledToGlyph.current = true;
      }
    },
    [navigate]
  );

  // Scroll on initial load if there's a hash
  useEffect(() => {
    if (location.hash && !hasScrolledToGlyph.current) {
      const id = location.hash.slice(1);
      scrollTo(id);
    }
  }, [location.hash, filteredFonts, scrollTo]);

  // Filter glyphs based on query and handle highlight
  useEffect(() => {
    if (!fonts) return;

    const glyphs = fonts[fontKey].glyphs;

    if (query) {
      const result = glyphs.filter((g) => g.character === query);
      const matchedGlyph = result[0];

      if (matchedGlyph) {
        setFilteredFonts(result);
        setHighlightedArea({
          x: matchedGlyph.gridLocation.x,
          y: matchedGlyph.gridLocation.y,
        });
        setDisableHighlightChange(true);
        previousQuery.current = query;

        navigate(`#${matchedGlyph.unicodeCode}`);
        setHash(matchedGlyph.unicodeCode);
        setNoQueryMatch(false);
      } else {
        setNoQueryMatch(true);
        setQueryMatches(
          Object.entries(fonts)
            .map(([key, value]) => {
              const matchingGlyphs = value.glyphs.filter(
                (glyph) => glyph.character === query
              );

              if (matchingGlyphs.length > 0) {
                return key;
              } else {
                return '';
              }
            })
            .filter((str) => /\w+/.test(str))
        );
      }
    } else {
      setFilteredFonts(glyphs);
      resetHighlightedArea(true);
      setDisableHighlightChange(false);

      if (previousQuery.current) {
        navigate('');
        setHash(null);
        previousQuery.current = '';
      }
      setNoQueryMatch(false);
    }
  }, [fonts, fontKey, query, navigate, resetHighlightedArea]);

  useEffect(() => {
    if (noQueryMatch) {
      setHighlightedArea({ x: -1, y: -1 });
    }
  }, [noQueryMatch]);

  return {
    highlightedArea,
    filteredFonts,
    hash,
    noQueryMatch,
    queryMatches,
    handleHoverChange,
    resetHighlightedArea,
    scrollTo,
  };
}
