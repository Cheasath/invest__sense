import { useEffect, useRef, useState, RefObject } from 'react';

export function useVisiblePolling(
  callback: () => void,
  intervalMs: number = 30000,
  elementRef?: RefObject<HTMLElement | null>
) {
  const [isVisible, setIsVisible] = useState(true);
  const [isTabFocused, setIsTabFocused] = useState(true);

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

    // Execute immediately when becoming visible
    callback();

    const timer = setInterval(() => {
      callback();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isTabFocused, isVisible, intervalMs, callback]);
}
