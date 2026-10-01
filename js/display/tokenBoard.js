// Renders privacy-safe public token boards showing current, next, and upcoming tokens.

import { MAX_VISIBLE_NEXT_TOKENS, PRIORITY } from '../config.js';
import { clearElement, createElement } from '../shared/dom.js';

export function renderTokenBoard(elements, queueData) {
  const { servingContainer, nextContainer, upcomingContainer } = elements;
  const { serving, nextToken, waiting = [] } = queueData;

  // 1. Render NOW SERVING
  clearElement(servingContainer);
  if (!serving) {
    const idleMsg = createElement('div', { className: 'display-idle-message' }, [
      'Waiting for the next patient'
    ]);
    servingContainer.appendChild(idleMsg);
  } else {
    const isEmergency = serving.priority === PRIORITY.EMERGENCY;
    const tokenEl = createElement('div', {
      className: `display-token-huge ${isEmergency ? 'token-emergency' : ''}`
    }, [`#${serving.token}`]);
    servingContainer.appendChild(tokenEl);
  }

  // 2. Render NEXT Token
  clearElement(nextContainer);
  if (nextToken != null) {
    const nextPatient = waiting.find((p) => p.token === nextToken);
    const isNextEmergency = nextPatient && nextPatient.priority === PRIORITY.EMERGENCY;
    const nextTokenEl = createElement('div', {
      className: `display-token-subhuge ${isNextEmergency ? 'token-emergency' : ''}`
    }, [`#${nextToken}`]);
    nextContainer.appendChild(nextTokenEl);
  } else {
    const emptyNextEl = createElement('div', { className: 'display-token-subhuge' }, ['—']);
    nextContainer.appendChild(emptyNextEl);
  }

  // 3. Render Next 5 Upcoming Tokens row (Strictly Tokens only, no names)
  clearElement(upcomingContainer);
  const upcomingSlice = waiting.slice(0, MAX_VISIBLE_NEXT_TOKENS);

  if (upcomingSlice.length === 0) {
    upcomingContainer.appendChild(createElement('p', { className: 'upcoming-empty' }, [
      'No tokens currently waiting'
    ]));
    return;
  }

  upcomingSlice.forEach((patient) => {
    const isEmergency = patient.priority === PRIORITY.EMERGENCY;
    const card = createElement('div', {
      className: `upcoming-token-card ${isEmergency ? 'is-emergency' : ''}`
    }, [
      createElement('span', { className: 'upcoming-token-num' }, [`#${patient.token}`]),
      createElement('span', { className: 'upcoming-token-tag' }, [isEmergency ? 'Emergency' : 'Normal'])
    ]);
    upcomingContainer.appendChild(card);
  });
}
