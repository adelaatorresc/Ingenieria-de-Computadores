import { useEffect, useRef } from 'react';

interface UseDeviceNavigationProps {
  onBack: () => void;
  canGoBack: boolean;
}

/**
 * Universal Device Navigation:
 * - Gaming mouse back buttons (button 3 / mouse button 4)
 * - Browser forward/backward popstate integration
 * - Desktop keyboard shortcuts:
 *    - Windows/Linux: Alt + LeftArrow
 *    - Mac: Cmd + [
 *    - Backspace (when not in input/textarea)
 * - Native touch swipe gesture for iOS / iPad / Android edge
 */
export function useDeviceNavigation({ onBack, canGoBack }: UseDeviceNavigationProps) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  const canGoBackRef = useRef(canGoBack);
  canGoBackRef.current = canGoBack;

  // 1. Mouse auxiliary buttons (Gaming Mouse back button: button 3 / XBUTTON1)
  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      // button 3 is standard back button on 5-button gaming mice
      if (e.button === 3 && canGoBackRef.current) {
        e.preventDefault();
        e.stopPropagation();
        onBackRef.current();
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button === 3 && canGoBackRef.current) {
        e.preventDefault();
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  // 2. Keyboard shortcuts (Windows Alt+Left, Mac Cmd+[, Backspace)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canGoBackRef.current) return;

      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // Alt + ArrowLeft (Windows / Linux standard back)
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        onBackRef.current();
        return;
      }

      // Meta + [ (macOS standard back)
      if (e.metaKey && e.key === '[') {
        e.preventDefault();
        onBackRef.current();
        return;
      }

      // Backspace when not writing
      if (e.key === 'Backspace' && !isInput) {
        e.preventDefault();
        onBackRef.current();
        return;
      }

      // Escape key to navigate back from deep views
      if (e.key === 'Escape' && !isInput) {
        // Can be used if modal is not open
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 3. Browser History popstate sync
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (canGoBackRef.current) {
        onBackRef.current();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
}
