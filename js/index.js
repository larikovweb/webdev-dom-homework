import { commentsArray } from './data.js';
import { useHTTP, _apiUrl } from './api.js';
import { showMessage } from './fn.js';
import CommentForm from './CommentForm.js';

const commentList = document.querySelector('.comments');
const commentForm = document.querySelector('.add-form');

const commentClass = new CommentForm(commentForm, commentList);

showMessage('Идет загрузка комментариев...', true, commentList);
useHTTP('GET', _apiUrl, (data) => {
  commentsArray.push(...data.comments);
  commentClass.renderComments();
  showMessage(null, false, commentList);
});
