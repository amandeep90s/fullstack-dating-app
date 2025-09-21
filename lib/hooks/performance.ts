/**
 * Performance optimization hooks and utilities
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Debounce hook for optimizing API calls and user interactions
 */
export function useDebounce<T extends (...args: any[]) => any>(callback: T, delay: number): T {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    ((...args: Parameters<T>) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    }) as T,
    [callback, delay]
  );
}

/**
 * Throttle hook for performance-critical operations
 */
export function useThrottle<T extends (...args: any[]) => any>(callback: T, limit: number): T {
  const inThrottle = useRef(false);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;
        setTimeout(() => (inThrottle.current = false), limit);
      }
    }) as T,
    [callback, limit]
  );
}

/**
 * Optimized previous value hook
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) {
  const isIntersecting = useRef(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    observer.current = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        isIntersecting.current = entry.isIntersecting;
      }
    }, options);

    observer.current.observe(elementRef.current);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [elementRef, options]);

  return isIntersecting.current;
}

/**
 * Optimized state update with comparison
 */
export function useOptimizedState<T>(
  initialState: T,
  compareFn?: (prev: T, next: T) => boolean
): [T, (newState: T) => void] {
  const [state, setState] = useState(initialState);

  const optimizedSetState = useCallback(
    (newState: T) => {
      setState((prevState) => {
        if (compareFn ? compareFn(prevState, newState) : prevState === newState) {
          return prevState;
        }
        return newState;
      });
    },
    [compareFn]
  );

  return [state, optimizedSetState];
}

/**
 * Memoized computation with dependency tracking
 */
export function useStableMemo<T>(factory: () => T, deps: React.DependencyList): T {
  return useMemo(factory, deps);
}
