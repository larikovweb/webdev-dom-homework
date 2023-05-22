export const protectionInnerHTML = (text) => {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

export const showMessage = (mess, isShow = true, parent) => {
  const message = document.createElement('div');
  if (!isShow) {
    parent.querySelector('.message').remove();
    return;
  }
  message.classList.add('message');
  message.innerHTML = mess;
  parent.appendChild(message);
};
