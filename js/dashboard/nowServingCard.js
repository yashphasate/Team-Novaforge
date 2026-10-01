// Renders the Now Serving card displaying current patient token and details.

import { clearElement, createElement } from '../shared/dom.js';
import { PRIORITY } from '../config.js';

export function renderNowServing(container, serving) {
  clearElement(container);

  if (!serving) {
    const placeholder = createElement('div', { className: 'now-serving-placeholder' }, [
      createElement('div', { className: 'now-serving-token' }, ['—']),
      createElement('p', {}, ['No patient currently in consultation'])
    ]);
    container.appendChild(placeholder);
    return;
  }

  const isEmergency = serving.priority === PRIORITY.EMERGENCY;

  const tokenWrapper = createElement('div', { className: 'now-serving-token-wrapper' }, [
    createElement('div', {
      className: `now-serving-token ${isEmergency ? 'emergency' : ''}`
    }, [`#${serving.token}`])
  ]);

  const nameEl = createElement('h3', { className: 'now-serving-patient' }, [serving.name]);

  const badgeClass = isEmergency ? 'badge-emergency' : 'badge-normal';
  const badgeText = isEmergency ? 'Emergency Triage' : 'Regular Walk-in';
  const badgeEl = createElement('span', { className: `badge ${badgeClass}` }, [badgeText]);

  const metaEl = createElement('div', { className: 'now-serving-meta' }, [
    badgeEl,
    createElement('span', {}, [`${serving.age} yrs`])
  ]);

  const doctorEl = createElement('div', { className: 'doctor-badge' }, [
    createElement('span', {}, ['Attending: Dr. Sarah Jenkins (Room 102)'])
  ]);

  container.appendChild(tokenWrapper);
  container.appendChild(nameEl);
  container.appendChild(metaEl);
  container.appendChild(doctorEl);
}
