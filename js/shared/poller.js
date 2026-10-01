// Non-overlapping interval poller to maintain synchronized state with the server.

export function startPolling(callback, intervalMs) {
  let isRunning = false;

  async function executeTick() {
    // Avoid concurrent requests if backend response takes longer than poll interval
    if (isRunning) {
      return;
    }

    isRunning = true;
    try {
      await callback();
    } finally {
      isRunning = false;
    }
  }

  // Execute immediately so the UI populates on first render without delay
  executeTick();
  const timerId = setInterval(executeTick, intervalMs);

  return () => clearInterval(timerId);
}
