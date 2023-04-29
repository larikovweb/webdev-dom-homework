class CommentForm {
  constructor(element, commentList) {
    if (!(element instanceof HTMLElement && commentList instanceof HTMLElement)) {
      throw new Error('Element is not an HTMLElement');
    }
    this.commentList = commentList;
    this.value = { name: '', comment: '', date: '' };
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
    const newComment = new Comment(this.value).render();
    this.commentList.appendChild(newComment);
    this.reset();
    this.input.focus();
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
    this.value = { name: '', comment: '', date: '' };
    this.input.value = '';
    this.textarea.value = '';
    this.isValid = false;
    this.disableBtn();
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
  const { name, comment, date } = value;
  const wrapper = document.createElement('div');
  wrapper.classList.add('comment');
  wrapper.innerHTML = `
  <div class="comment-header">
    <div>${name}</div>
    <div>${date}</div>
  </div>
  <div class="comment-body">
    <div class="comment-text">${comment}</div>
  </div>
  <div class="comment-footer">
    <div class="likes">
      <span class="likes-counter">0</span>
      <button class="like-button"></button>
    </div>
  </div>
  `;

  const likesCounter = wrapper.querySelector('.likes-counter');
  const likeButton = wrapper.querySelector('.like-button');
  likeButton.addEventListener('click', () => {
    likeButton.classList.toggle('-active-like');
    likeButton.classList.contains('-active-like')
      ? likesCounter.textContent++
      : likesCounter.textContent--;
  });

  return wrapper;
};

const commentList = document.querySelector('.comments');
const commentForm = document.querySelector('.add-form');

const commentClass = new CommentForm(commentForm, commentList);
