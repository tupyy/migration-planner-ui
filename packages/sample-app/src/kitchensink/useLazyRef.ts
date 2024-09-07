import { useRef, useCallback } from "react";

export const useLazyRef = <T>(
  onRefMounted: (node: T) => void
): [React.MutableRefObject<T | undefined>, (node: T) => void] => {
  const ref = useRef<T>();

  const callbackRef = useCallback(
    (node: T) => {
      if (node) {
        ref.current = node;
        onRefMounted(node);
      }
    },
    [onRefMounted]
  );

  return [ref, callbackRef];
};
