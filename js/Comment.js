import { commentsArray } from './data.js';
import { protectionInnerHTML } from './fn.js';
import { commentFormClass } from './CommentForm.js';

class Comment {
  constructor(value) {
    this.value = value;
  }
  render() {
    return Comment.commentTemplate(this.value);
  }
}
Comment.commentTemplate = (value) => {
  let { author, text, date, likes, isLiked } = value;
  const wrapper = document.createElement('div');
  wrapper.classList.add('comment');
  wrapper.innerHTML = `
  <i class="comment-remove"></i>
  <div class="comment-header">
    <div>${protectionInnerHTML(author.name)}</div>
    <div>${date}</div>
  </div>
  <div class="comment-body">
    <pre class="comment-text">${protectionInnerHTML(text)}</pre>
  </div>
  <div class="comment-footer">
    <div class="likes">
      <span class="likes-counter">${likes}</span>
      <button class="like-button ${isLiked && '-active-like'}"></button>
    </div>
  </div>
  `;

  const likesCounter = wrapper.querySelector('.likes-counter');
  const likeButton = wrapper.querySelector('.like-button');
  const removeButton = wrapper.querySelector('.comment-remove');

  const onAnswer = () => {
    commentFormClass.value.text = `> ${text} \r\n ${author.name},`;
    commentFormClass.update();
    commentFormClass.input.focus();
  };

  const onLike = (e) => {
    e.stopPropagation();
    likeButton.classList.toggle('-active-like');
    if (likeButton.classList.contains('-active-like')) {
      isLiked = true;
      likes++;
      likesCounter.textContent++;
    } else {
      isLiked = false;
      likes--;
      likesCounter.textContent--;
    }
  };

  const onRemove = (e) => {
    e.stopPropagation();
    wrapper.remove();
    commentsArray.splice(commentsArray.indexOf(value), 1);
  };

  wrapper.addEventListener('click', onAnswer);
  likeButton.addEventListener('click', onLike);
  removeButton.addEventListener('click', onRemove);

  return wrapper;
};

export default Comment;
