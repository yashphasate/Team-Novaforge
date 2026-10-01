// Receptionist dashboard orchestrator connecting polling, state renderers, and user actions.

import { POLL_INTERVAL_MS } from '../config.js';
import { fetchQueue, callNextPatient, cancelPatient } from '../shared/api.js';
import { $ } from '../shared/dom.js';
import { startPolling } from '../shared/poller.js';
import { initMessages, showSuccess, showError } from './messages.js';
import { initRegistrationForm } from './registrationForm.js';
import { renderNowServing } from './nowServingCard.js';
import { renderWaitingTable } from './queueTable.js';
import { renderStats } from './statsBar.js';
import { initDemoControls } from './demoControls.js';

document.addEventListener('DOMContentLoaded', () => {
  const messageBannerContainer = $('#message-banner');
  initMessages(messageBannerContainer);

  const nowServingContainer = $('#now-serving-container');
  const nextPatientBtn = $('#btn-next-patient');
  const queueTbody = $('#queue-tbody');
  const queueTableWrapper = $('#queue-table-wrapper');
  const emptyQueueState = $('#empty-queue-state');

  const statsElements = {
    waitingCount: $('#stat-waiting'),
    servedToday: $('#stat-served'),
    cancelledToday: $('#stat-cancelled'),
    emergenciesToday: $('#stat-emergencies')
  };

  async function refreshQueue() {
    try {
      const data = await fetchQueue();
      renderNowServing(nowServingContainer, data.serving);
      renderWaitingTable(queueTbody, emptyQueueState, queueTableWrapper, data.waiting, handleCancelPatient);
      renderStats(statsElements, data.stats);

      const hasWaiting = Array.isArray(data.waiting) && data.waiting.length > 0;
      nextPatientBtn.disabled = !hasWaiting;
    } catch (err) {
      showError(err.message);
    }
  }

  async function handleCancelPatient(id, buttonEl) {
    try {
      await cancelPatient(id);
      showSuccess('Patient registration was cancelled.');
      await refreshQueue();
    } catch (err) {
      showError(err.message);
      if (buttonEl) {
        buttonEl.disabled = false;
        buttonEl.textContent = 'Cancel';
      }
    }
  }

  nextPatientBtn.addEventListener('click', async () => {
    nextPatientBtn.disabled = true;
    const originalText = nextPatientBtn.textContent;
    nextPatientBtn.textContent = 'Calling Next...';

    try {
      const result = await callNextPatient();
      if (result.message) {
        showSuccess(result.message);
      }
      await refreshQueue();
    } catch (err) {
      showError(err.message);
    } finally {
      nextPatientBtn.textContent = originalText;
    }
  });

  initRegistrationForm({
    form: $('#registration-form'),
    nameInput: $('#patient-name'),
    ageInput: $('#patient-age'),
    nameError: $('#name-error'),
    ageError: $('#age-error'),
    submitButton: $('#btn-issue-token')
  }, {
    onSuccess: (result) => {
      showSuccess(`Token ${result.token} issued to ${result.name}`);
      refreshQueue();
    },
    onError: (msg) => showError(msg)
  });

  initDemoControls({
    seedButton: $('#btn-demo-seed'),
    resetButton: $('#btn-demo-reset')
  }, {
    onSuccess: (msg) => {
      showSuccess(msg);
      refreshQueue();
    },
    onError: (msg) => showError(msg)
  });

  startPolling(refreshQueue, POLL_INTERVAL_MS);
});
