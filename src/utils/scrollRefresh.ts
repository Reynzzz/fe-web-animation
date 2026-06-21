import { ScrollTrigger } from 'gsap/ScrollTrigger';

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

export function debouncedScrollRefresh(delay = 200) {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    ScrollTrigger.refresh();
    refreshTimer = null;
  }, delay);
}
