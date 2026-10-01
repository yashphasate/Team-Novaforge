// Handles patient registration validation, submission, and inline field error rendering.

import { MAX_NAME_LENGTH, MIN_AGE, MAX_AGE, PRIORITY } from '../config.js';
import { registerPatient } from '../shared/api.js';
import { setText } from '../shared/dom.js';

function validateName(name) {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return "Please enter the patient's name";
  }
  if (trimmed.length > MAX_NAME_LENGTH) {
    return `Name must be ${MAX_NAME_LENGTH} characters or fewer`;
  }
  return null;
}

function validateAge(ageValue) {
  if (ageValue === '' || ageValue === null || ageValue === undefined) {
    return `Age must be a whole number between ${MIN_AGE} and ${MAX_AGE}`;
  }
  const num = Number(ageValue);
  if (!Number.isInteger(num) || num < MIN_AGE || num > MAX_AGE) {
    return `Age must be a whole number between ${MIN_AGE} and ${MAX_AGE}`;
  }
  return null;
}

function clearFieldErrors(elements) {
  setText(elements.nameError, '');
  setText(elements.ageError, '');
  elements.nameInput.classList.remove('has-error');
  elements.ageInput.classList.remove('has-error');
}

function showFieldErrors(errors, elements) {
  if (errors.name) {
    setText(elements.nameError, errors.name);
    elements.nameInput.classList.add('has-error');
  }
  if (errors.age) {
    setText(elements.ageError, errors.age);
    elements.ageInput.classList.add('has-error');
  }
}

export function initRegistrationForm(elements, { onSuccess, onError }) {
  const { form, nameInput, ageInput, submitButton } = elements;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFieldErrors(elements);

    const name = nameInput.value;
    const ageRaw = ageInput.value;
    const priority = form.elements.priority.value || PRIORITY.NORMAL;

    const errors = {
      name: validateName(name),
      age: validateAge(ageRaw)
    };

    if (errors.name || errors.age) {
      showFieldErrors(errors, elements);
      return;
    }

    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Issuing Token...';

    try {
      const patientData = {
        name: name.trim(),
        age: parseInt(ageRaw, 10),
        priority
      };
      const result = await registerPatient(patientData);
      form.reset();
      // Ensure priority resets explicitly to normal default
      const normalRadio = form.querySelector('input[name="priority"][value="normal"]');
      if (normalRadio) normalRadio.checked = true;

      onSuccess(result);
    } catch (err) {
      onError(err.message);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}
