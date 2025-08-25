import { useCallback, useEffect, useState } from "react";

interface UseScreensaverProps {
  timeout?: number; // dalam milidetik, default 5 menit
  onIdle?: () => void;
  onActive?: () => void;
}

export const useScreensaver = ({
  timeout = 5 * 60 * 1000, // 5 menit
  onIdle,
  onActive,
}: UseScreensaverProps = {}) => {
  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const resetTimer = useCallback(() => {
    setLastActivity(Date.now());
    if (isIdle) {
      setIsIdle(false);
      onActive?.();
    }
  }, [isIdle, onActive]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const throttle = (func: Function, limit: number) => {
      let inThrottle: boolean;
      return function (this: any, ...args: any[]) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    };

    const throttledHandleActivity = throttle(handleActivity, 1000);

    events.forEach((event) => {
      document.addEventListener(event, throttledHandleActivity, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, throttledHandleActivity, true);
      });
    };
  }, [handleActivity]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity >= timeout && !isIdle) {
        setIsIdle(true);
        onIdle?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivity, timeout, isIdle, onIdle]);

  return {
    isIdle,
    resetTimer,
    lastActivity,
  };
};
