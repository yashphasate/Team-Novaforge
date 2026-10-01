// Real-time clock updater for headers and status displays.

import { setText } from './dom.js';

export function startClock(element) {
  function tick() {
    const now = new Date();
    // Providing 2-digit components prevents layout shifting every second
    const timeString = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    setText(element, timeString);

    const dateEl = document.getElementById('display-date');
    if (dateEl) {
      const dateString = now.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      setText(dateEl, `📅 ${dateString}`);
    }
  }

  tick();
  const timerId = setInterval(tick, 1000);

  // Return teardown callback in case consumer needs to cancel the timer
  return () => clearInterval(timerId);
}
