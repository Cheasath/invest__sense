import { useEffect, useRef, useState, RefObject } from 'react';

export function useVisiblePolling(
  callback: () => void,
  intervalMs: number = 30000,
  elementRef?: RefObject<HTMLElement | null>
) {
  const [isVisible, setIsVisible] = useState(true);
  const [isTabFocused, setIsTabFocused] = useState(true);
  const callbackRef = useRef(callback);
  const lastExecutedRef = useRef<number>(0);

  // Keep latest callback reference without triggering re-subscriptions
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Track page visibility tab focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabFocused(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Track element visibility in viewport via IntersectionObserver
  useEffect(() => {
    if (!elementRef || !elementRef.current) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [elementRef]);

  // Polling timer active only when visible AND tab focused
  useEffect(() => {
    if (!isTabFocused || !isVisible) return;

    // Run once on visibility if not run within the last interval
    const now = Date.now();
    if (now - lastExecutedRef.current >= intervalMs) {
      lastExecutedRef.current = now;
      callbackRef.current();
    }

    const timer = setInterval(() => {
      lastExecutedRef.current = Date.now();
      callbackRef.current();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isTabFocused, isVisible, intervalMs]);
}
