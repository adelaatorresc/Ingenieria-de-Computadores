import { useEffect, useRef } from 'react';

interface UseSwipeGestureProps {
  onSwipeBack: () => void;
  enabled?: boolean;
}

/**
 * Native iOS / iPad left-edge swipe gesture hook:
 * When the user swipes from the left edge (startX <= 50px) to the right (> 60px),
 * triggers the onSwipeBack callback.
 */
export function useSwipeGesture({ onSwipeBack, enabled = true }: UseSwipeGestureProps) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      // Only initiate gesture if touch started near the left edge (typical iOS back gesture)
      if (touch.clientX <= 60) {
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now()
        };
      } else {
        touchStartRef.current = null;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Check conditions:
      // 1. Swiped to the right by at least 60px
      // 2. Horizontal displacement dominates vertical movement (at least 1.8x)
      // 3. Movement happened within a reasonable swipe time (< 600ms) or distance > 100px
      if (deltaX >= 60 && deltaX > deltaY * 1.8 && (deltaTime < 600 || deltaX > 100)) {
        onSwipeBack();
      }

      touchStartRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeBack, enabled]);
}
