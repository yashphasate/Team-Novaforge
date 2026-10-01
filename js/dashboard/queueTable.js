// Renders waiting queue table rows, emergency indicators, and empty state.

import { clearElement, createElement } from '../shared/dom.js';
import { PRIORITY } from '../config.js';

function createRow(patient, onCancel) {
  const isEmergency = patient.priority === PRIORITY.EMERGENCY;
  const row = createElement('tr', {
    className: isEmergency ? 'row-emergency' : ''
  });

  const badgeClass = isEmergency ? 'badge-emergency' : 'badge-normal';
  const badgeText = isEmergency ? 'Emergency' : 'Regular';

  let waitPillClass = 'wait-pill';
  if (patient.estimatedWaitMinutes != null) {
    if (patient.estimatedWaitMinutes <= 10) waitPillClass += ' fast';
    else if (patient.estimatedWaitMinutes <= 30) waitPillClass += ' medium';
  }

  const waitPill = createElement('span', { className: waitPillClass }, [
    patient.estimatedWaitMinutes != null ? `${patient.estimatedWaitMinutes} mins` : '—'
  ]);

  const cancelBtn = createElement('button', {
    type: 'button',
    className: 'btn btn-danger',
    title: 'Cancel token',
    events: {
      click: async () => {
        if (!window.confirm(`Cancel token #${patient.token} for ${patient.name}?`)) {
          return;
        }
        cancelBtn.disabled = true;
        cancelBtn.textContent = 'Cancelling...';
        await onCancel(patient.id, cancelBtn);
      }
    }
  }, ['Cancel']);

  row.append(
    createElement('td', {}, [
      createElement('strong', { style: 'color: var(--color-text-muted);' }, [
        patient.position != null ? `#${patient.position}` : '—'
      ])
    ]),
    createElement('td', { className: `token-cell ${isEmergency ? 'emergency' : ''}` }, [`#${patient.token}`]),
    createElement('td', {}, [
      createElement('span', { style: 'font-weight:700;' }, [patient.name])
    ]),
    createElement('td', {}, [`${patient.age} yrs`]),
    createElement('td', {}, [createElement('span', { className: `badge ${badgeClass}` }, [badgeText])]),
    createElement('td', {}, [waitPill]),
    createElement('td', {}, [cancelBtn])
  );

  return row;
}

export function renderWaitingTable(tbody, emptyContainer, tableWrapper, waitingList, onCancel) {
  clearElement(tbody);

  if (!waitingList || waitingList.length === 0) {
    tableWrapper.style.display = 'none';
    emptyContainer.style.display = 'flex';
    return;
  }

  tableWrapper.style.display = 'block';
  emptyContainer.style.display = 'none';

  waitingList.forEach((patient) => {
    tbody.appendChild(createRow(patient, onCancel));
  });
}
