// Renders waiting queue table rows, emergency indicators, and empty state.

import { clearElement, createElement } from '../shared/dom.js';
import { PRIORITY } from '../config.js';

function createRow(patient, onCancel) {
  const isEmergency = patient.priority === PRIORITY.EMERGENCY;
  const row = createElement('tr', {
    className: isEmergency ? 'row-emergency' : ''
  });

  const badgeClass = isEmergency ? 'badge-emergency' : 'badge-normal';
  const badgeText = isEmergency ? 'Emergency' : 'Normal';
  const waitText = patient.estimatedWaitMinutes != null ? `${patient.estimatedWaitMinutes} min` : '—';

  const cancelBtn = createElement('button', {
    type: 'button',
    className: 'btn btn-danger',
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
    createElement('td', {}, [patient.position != null ? `#${patient.position}` : '—']),
    createElement('td', { className: `token-cell ${isEmergency ? 'emergency' : ''}` }, [`#${patient.token}`]),
    createElement('td', {}, [patient.name]),
    createElement('td', {}, [`${patient.age}`]),
    createElement('td', {}, [createElement('span', { className: `badge ${badgeClass}` }, [badgeText])]),
    createElement('td', {}, [waitText]),
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
