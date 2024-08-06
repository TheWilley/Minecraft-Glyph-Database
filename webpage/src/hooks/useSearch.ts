import { useState } from 'react';

export default function useSearch() {
  const [query, setQuery] = useState('');

  return [query, setQuery] as const;
}
