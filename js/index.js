import { commentsArray } from './data.js';
import { fetchAllComments, _apiUrl } from './api.js';
import { showMessage } from './fn.js';
import { commentFormClass } from './CommentForm.js';
import { formAuthClass } from './AuthForm.js';

const commentList = document.querySelector('.comments');
const authBtn = document.querySelector('.auth-btn');

showMessage('Идет загрузка комментариев...', true, commentList);

fetchAllComments((data) => {
  commentsArray.push(...data.comments);
  commentFormClass.renderComments();
  showMessage(null, false, commentList);
});

authBtn.addEventListener('click', () => {
  authBtn.style.display = 'none';
  formAuthClass.onToggleForm();
});
