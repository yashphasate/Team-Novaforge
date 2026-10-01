// DOM query, construction, and manipulation utilities ensuring safe text rendering.

export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

export function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function setText(element, text) {
  element.textContent = text !== null && text !== undefined ? String(text) : '';
}

export function createElement(tag, props = {}, children = []) {
  const el = document.createElement(tag);

  Object.entries(props).forEach(([key, value]) => {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'dataset' && typeof value === 'object') {
      Object.assign(el.dataset, value);
    } else if (key === 'events' && typeof value === 'object') {
      Object.entries(value).forEach(([event, handler]) => {
        el.addEventListener(event, handler);
      });
    } else if (key === 'disabled') {
      el.disabled = Boolean(value);
    } else if (value !== null && value !== undefined) {
      el.setAttribute(key, value);
    }
  });

  const childList = Array.isArray(children) ? children : [children];
  childList.forEach((child) => {
    if (child instanceof Node) {
      el.appendChild(child);
    } else if (child !== null && child !== undefined) {
      // Create text nodes explicitly to eliminate XSS risks from patient data
      el.appendChild(document.createTextNode(String(child)));
    }
  });

  return el;
}
