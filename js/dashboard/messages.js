// Banner notification manager with accessible aria-live announcements.

import { clearElement, createElement } from '../shared/dom.js';

let container = null;
let timeoutId = null;

export function initMessages(element) {
  container = element;
}

export function clearMessage() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  if (container) {
    clearElement(container);
  }
}

export function showSuccess(message, autoDismissMs = 6000) {
  clearMessage();
  if (!container) return;

  const banner = createElement('div', {
    className: 'banner banner-success',
    role: 'status',
    'aria-live': 'polite'
  }, [message]);

  container.appendChild(banner);

  if (autoDismissMs > 0) {
    timeoutId = setTimeout(clearMessage, autoDismissMs);
  }
}

export function showError(message) {
  clearMessage();
  if (!container) return;

  const banner = createElement('div', {
    className: 'banner banner-error',
    role: 'alert',
    'aria-live': 'assertive'
  }, [message]);

  container.appendChild(banner);
}
