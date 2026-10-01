// Public waiting area display orchestrator managing polling, clock, and pulse animations.

import { POLL_INTERVAL_MS } from '../config.js';
import { fetchQueue } from '../shared/api.js';
import { $ } from '../shared/dom.js';
import { startClock } from '../shared/clock.js';
import { startPolling } from '../shared/poller.js';
import { renderTokenBoard } from './tokenBoard.js';
import { triggerPulseOnChange } from './pulse.js';

document.addEventListener('DOMContentLoaded', () => {
  const clockElement = $('#display-clock');
  startClock(clockElement);

  const servingPanel = $('#serving-panel');
  const boardElements = {
    servingContainer: $('#serving-container'),
    nextContainer: $('#next-container'),
    upcomingContainer: $('#upcoming-tokens-container')
  };

  async function updateDisplay() {
    try {
      const data = await fetchQueue();
      triggerPulseOnChange(servingPanel, data.serving);
      renderTokenBoard(boardElements, data);
    } catch {
      // Waiting room screens must degrade gracefully without intrusive popups
    }
  }

  startPolling(updateDisplay, POLL_INTERVAL_MS);
});
