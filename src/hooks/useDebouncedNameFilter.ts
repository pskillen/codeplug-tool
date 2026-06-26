import { useDebouncedValue } from '@mantine/hooks';
import { useCallback, useEffect, useRef, useState } from 'react';

/** Settle time before list name search updates URL, storage, and table filtering. */
export const LIST_NAME_FILTER_DEBOUNCE_MS = 300;

export function useDebouncedNameFilter(
  committedFilter: string,
  commitFilter: (value: string) => void,
): {
  nameFilterInput: string;
  setNameFilter: (value: string) => void;
  nameFilterPending: boolean;
} {
  const [nameFilterInput, setNameFilterInput] = useState(committedFilter);
  const [debouncedInput] = useDebouncedValue(nameFilterInput, LIST_NAME_FILTER_DEBOUNCE_MS);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (!isTypingRef.current) {
      setNameFilterInput(committedFilter);
    }
  }, [committedFilter]);

  useEffect(() => {
    if (debouncedInput !== committedFilter) {
      if (isTypingRef.current) {
        commitFilter(debouncedInput);
      }
    } else {
      isTypingRef.current = false;
    }
  }, [debouncedInput, committedFilter, commitFilter]);

  const setNameFilter = useCallback((value: string) => {
    isTypingRef.current = true;
    setNameFilterInput(value);
  }, []);

  return {
    nameFilterInput,
    setNameFilter,
    nameFilterPending: nameFilterInput !== committedFilter,
  };
}
