import { playHospitalChime } from '../shared/chime.js';

let previousToken = null;
let isInitialRun = true;

export function triggerPulseOnChange(element, currentServing) {
  const currentToken = currentServing ? currentServing.token : null;

  // Avoid flashing on first screen load when data initially populates
  if (isInitialRun) {
    previousToken = currentToken;
    isInitialRun = false;
    return;
  }

  // Flash only when transition represents a new active patient
  if (currentToken !== null && currentToken !== previousToken) {
    playHospitalChime();
    element.classList.remove('pulse-animation');
    // Read offsetWidth to force style recalculation and restart keyframe
    void element.offsetWidth;
    element.classList.add('pulse-animation');

    element.addEventListener('animationend', () => {
      element.classList.remove('pulse-animation');
    }, { once: true });
  }

  previousToken = currentToken;
}
