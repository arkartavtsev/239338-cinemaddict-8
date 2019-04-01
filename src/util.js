export const createElement = (template) => {
  const newElement = document.createElement(`div`);

  newElement.innerHTML = template;

  return newElement.firstChild;
};


export const hideMessage = (container) => {
  const msg = container.querySelector(`.load-msg`);

  if (msg) {
    msg.remove();
  }
};

export const showMessage = (text, container) => {
  hideMessage(container);

  const msg = document.createElement(`p`);

  msg.classList.add(`load-msg`);
  msg.textContent = text;
  container.prepend(msg);
};
