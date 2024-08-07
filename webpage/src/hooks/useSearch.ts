import { useState } from 'react';


/**
 * Custom hook for managing a search query state.
 *
 * @returns A tuple containing:
 *   - The current search query.
 *   - A function to update the search query.
 */
export default function useSearch() {
  const [query, setQuery] = useState('');

  return [query, setQuery] as const;
}
