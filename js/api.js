import { token } from './data.js';

export const _apiUrl = 'https://webdev-hw-api.vercel.app/api/v2/:yuriy-larikov/comments';

// export const useHTTP = (method, url, func, body) => {
//   fetch(url, {
//     method: method,
//     body: JSON.stringify(body),
//   })
//     .then((res) => {
//       if (res.ok) {
//         return res.json();
//       } else if (res.status >= 500 && res.status < 600) {
//         throw new Error('Сервер сломался, попробуй позже');
//       } else if (res.status === 400) {
//         throw new Error('Имя и комментарий должны быть не короче 3 символов');
//       }
//     })
//     .then(func)
//     .catch((err) => {
//       console.warn(err);
//       alert(
//         err.message === 'Failed to fetch' ? 'Что-то пошло не так, попробуйте позже' : err.message,
//       );
//       func();
//     });
// };

export const sendComment = (func, body) => {
  fetch(_apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token[0]}`,
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      console.log(res);
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

export const fetchAllComments = (func) => {
  fetch(_apiUrl, {
    method: 'GET',
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else if (res.status >= 500 && res.status < 600) {
        throw new Error('Сервер сломался, попробуй позже');
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

export const toggleLike = (id) => {
  fetch(_apiUrl + `/${id}/toggle-like`, {
    method: 'POST',
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else if (res.status >= 500 && res.status < 600) {
        throw new Error('Сервер сломался, попробуй позже');
      }
    })
    .catch((err) => {
      console.warn(err);
      alert(
        err.message === 'Failed to fetch' ? 'Что-то пошло не так, попробуйте позже' : err.message,
      );
    });
};

const _userUrl = 'https://wedev-api.sky.pro/api/user';
export const registerUser = (func, data) => {
  fetch(_userUrl, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((res) => {
      console.log(res);
      if (res.ok) {
        return res.json();
      } else if (res.status >= 500 && res.status < 600) {
        throw new Error('Сервер сломался, попробуй позже');
      }
    })
    .then(func)
    .catch((err) => {
      console.warn(err);
      alert('Такой пользователь уже существует');
    });
};

export const loginUser = (func, data) => {
  fetch(_userUrl + '/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((res) => {
      console.log(res);
      if (res.ok) {
        return res.json();
      } else if (res.status >= 500 && res.status < 600) {
        throw new Error('Сервер сломался, попробуй позже');
      }
    })
    .then(func)
    .catch((err) => {
      console.warn(err);
      alert('Такого пользователя нет');
    });
};
