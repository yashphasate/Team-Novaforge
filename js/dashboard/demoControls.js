// Manages demo data seeding and resetting controls with confirmation prompts.

import { seedDemoData, resetDemoData } from '../shared/api.js';

export function initDemoControls(elements, { onSuccess, onError }) {
  const { seedButton, resetButton } = elements;

  seedButton.addEventListener('click', async () => {
    seedButton.disabled = true;
    const originalText = seedButton.textContent;
    seedButton.textContent = 'Loading...';

    try {
      await seedDemoData();
      onSuccess('Demo queue data loaded with 5 sample patients.');
    } catch (err) {
      onError(err.message);
    } finally {
      seedButton.disabled = false;
      seedButton.textContent = originalText;
    }
  });

  resetButton.addEventListener('click', async () => {
    if (!window.confirm('Are you sure you want to reset all demo queue data? This cannot be undone.')) {
      return;
    }

    resetButton.disabled = true;
    const originalText = resetButton.textContent;
    resetButton.textContent = 'Resetting...';

    try {
      await resetDemoData();
      onSuccess('Demo data reset successfully.');
    } catch (err) {
      onError(err.message);
    } finally {
      resetButton.disabled = false;
      resetButton.textContent = originalText;
    }
  });
}
