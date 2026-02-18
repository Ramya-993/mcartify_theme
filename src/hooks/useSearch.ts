'use client'
import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

const useSearch = (searchString: string, array: any[], key: string) => {
  const [matchingList, setMatchingList] = useState<any[]>([]);

  useEffect(() => {
    if (searchString === "") {
      setMatchingList(array);
    } else {
      const fuse = new Fuse(array, {
        keys: [key],
        threshold: 0, // Exact match
        ignoreLocation: true, // Search the entire string
        shouldSort: true, // Sort results by relevance
        includeMatches: false, // We don't need match details
        minMatchCharLength: searchString.length, // Require all characters to match
      });
      
      const result = fuse.search(searchString).map((item) => item.item);
      setMatchingList(result);
    }
  }, [searchString, array, key]);

  return matchingList;
};

export default useSearch