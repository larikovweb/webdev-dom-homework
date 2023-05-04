const commentsArray = localStorage.getItem('comments')
  ? JSON.parse(localStorage.getItem('comments'))
  : [];

const saveLocaleStorage = (key, array) => {
  localStorage.setItem(key, JSON.stringify(array));
};
const protectionInnerHTML = (text) => {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
class CommentForm {
  constructor(element, commentList) {
    if (!(element instanceof HTMLElement && commentList instanceof HTMLElement)) {
      throw new Error('Element is not an HTMLElement');
    }
    this.commentList = commentList;
    this.value = { name: '', comment: '', date: '', like: { count: 0, active: false } };
    this.element = element;
    this.isValid = false;
    this.input = this.element.querySelector('input');
    this.textarea = this.element.querySelector('textarea');
    this.button = this.element.querySelector('button');
    this.button.addEventListener('click', this.onSubmit.bind(this));
    this.input.addEventListener('keydown', this.onPressEnter.bind(this));
    this.textarea.addEventListener('keydown', this.onPressEnter.bind(this));
    this.input.addEventListener('input', this.onChange.bind(this));
    this.textarea.addEventListener('input', this.onChange.bind(this));
    this.input.focus();
  }
  onSubmit() {
    if (!this.isValid) return;
    this.value.date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
    commentsArray.push(this.value);
    saveLocaleStorage('comments', commentsArray);
    const newComment = new Comment(this.value).render();
    this.commentList.appendChild(newComment);
    this.reset();
    this.input.focus();
  }
  update() {
    this.input.value = this.value.name;
    this.textarea.value = this.value.comment;
    this.isValid = this.value.name && this.value.comment;
    this.disableBtn();
  }
  onChange() {
    this.value.name = this.input.value;
    this.value.comment = this.textarea.value;
    this.isValid = this.value.name && this.value.comment;
    this.disableBtn();
  }
  onPressEnter(event) {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }
  disableBtn() {
    this.isValid
      ? this.button.removeAttribute('disabled')
      : this.button.setAttribute('disabled', true);
  }
  reset() {
    this.value = { name: '', comment: '', date: '', like: { count: 0, active: false } };
    this.input.value = '';
    this.textarea.value = '';
    this.isValid = false;
    this.disableBtn();
  }
  renderComments() {
    commentsArray.forEach((comment) => {
      const newComment = new Comment(comment).render();
      this.commentList.appendChild(newComment);
    });
  }
}
class Comment {
  constructor(value) {
    this.value = value;
  }
  render() {
    return Comment.commentTemplate(this.value);
  }
}
Comment.commentTemplate = (value) => {
  const { name, comment, date, like } = value;
  const wrapper = document.createElement('div');
  wrapper.classList.add('comment');
  wrapper.innerHTML = `
  <i class="comment-remove"></i>
  <div class="comment-header">
    <div>${protectionInnerHTML(name)}</div>
    <div>${date}</div>
  </div>
  <div class="comment-body">
    <pre class="comment-text">${protectionInnerHTML(comment)}</pre>
  </div>
  <div class="comment-footer">
    <div class="likes">
      <span class="likes-counter">${like.count}</span>
      <button class="like-button ${like.active && '-active-like'}"></button>
    </div>
  </div>
  `;

  const likesCounter = wrapper.querySelector('.likes-counter');
  const likeButton = wrapper.querySelector('.like-button');
  const removeButton = wrapper.querySelector('.comment-remove');

  const onAnswer = () => {
    commentClass.value.comment = `> ${comment} \r\n ${name},`;
    commentClass.update();
    commentClass.input.focus();
  };

  const onLike = (e) => {
    e.stopPropagation();
    likeButton.classList.toggle('-active-like');
    if (likeButton.classList.contains('-active-like')) {
      like.active = true;
      like.count++;
      likesCounter.textContent++;
    } else {
      like.active = false;
      like.count--;
      likesCounter.textContent--;
    }
    saveLocaleStorage('comments', commentsArray);
  };

  const onRemove = (e) => {
    e.stopPropagation();
    wrapper.remove();
    commentsArray.splice(commentsArray.indexOf(value), 1);
    saveLocaleStorage('comments', commentsArray);
  };

  wrapper.addEventListener('click', onAnswer);
  likeButton.addEventListener('click', onLike);
  removeButton.addEventListener('click', onRemove);

  return wrapper;
};

const commentList = document.querySelector('.comments');
const commentForm = document.querySelector('.add-form');

const commentClass = new CommentForm(commentForm, commentList);
commentClass.renderComments();
