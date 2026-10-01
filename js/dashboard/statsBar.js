// Renders clinic throughput statistics including waiting, served, cancelled, and emergencies.

import { setText } from '../shared/dom.js';

export function renderStats(elements, stats = {}) {
  const { waitingCount = 0, servedToday = 0, cancelledToday = 0, emergenciesToday = 0 } = stats;

  setText(elements.waitingCount, waitingCount);
  setText(elements.servedToday, servedToday);
  setText(elements.cancelledToday, cancelledToday);
  setText(elements.emergenciesToday, emergenciesToday);
}
