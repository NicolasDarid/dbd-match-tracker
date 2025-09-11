"use client";
import { useEffect, useState } from "react";

export function useDebounceValue<T>(value: T, delay = 1000) {
  const [debounceState, setDebounceState] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceState(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debounceState;
}
