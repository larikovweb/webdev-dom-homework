export const _apiUrl = 'https://webdev-hw-api.vercel.app/api/v1/:yuriy-larikov/comments';

export const useHTTP = (method, url, func, body) => {
  fetch(url, {
    method: method,
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else if (res.status >= 500 && res.status < 600) {
        throw new Error('Сервер сломался, попробуй позже');
      } else if (res.status === 400) {
        throw new Error('Имя и комментарий должны быть не короче 3 символов');
      }
    })
    .then(func)
    .catch((err) => {
      console.warn(err);
      alert(
        err.message === 'Failed to fetch' ? 'Что-то пошло не так, попробуйте позже' : err.message,
      );
      func();
    });
};
