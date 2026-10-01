// Renders the Now Serving card displaying current patient token and details.

import { clearElement, createElement, setText } from '../shared/dom.js';
import { PRIORITY } from '../config.js';

export function renderNowServing(container, serving) {
  clearElement(container);

  if (!serving) {
    const placeholder = createElement('div', { className: 'now-serving-placeholder' }, [
      createElement('div', { className: 'now-serving-token' }, ['—']),
      createElement('p', {}, ['No patient being served'])
    ]);
    container.appendChild(placeholder);
    return;
  }

  const tokenEl = createElement('div', {
    className: `now-serving-token ${serving.priority === PRIORITY.EMERGENCY ? 'emergency' : ''}`
  }, [`#${serving.token}`]);

  const nameEl = createElement('h3', { className: 'now-serving-patient' }, [serving.name]);

  const badgeClass = serving.priority === PRIORITY.EMERGENCY ? 'badge-emergency' : 'badge-normal';
  const badgeText = serving.priority === PRIORITY.EMERGENCY ? 'Emergency' : 'Normal';
  const badgeEl = createElement('span', { className: `badge ${badgeClass}` }, [badgeText]);

  const metaEl = createElement('div', { className: 'now-serving-meta' }, [
    badgeEl,
    createElement('span', {}, [`${serving.age} yrs`])
  ]);

  container.appendChild(tokenEl);
  container.appendChild(nameEl);
  container.appendChild(metaEl);
}
