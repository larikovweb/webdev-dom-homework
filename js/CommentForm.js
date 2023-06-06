import { commentsArray } from './data.js';
import { sendComment, _apiUrl } from './api.js';
import { showMessage } from './fn.js';
import Comment from './Comment.js';

class CommentForm {
  constructor(element, commentList) {
    if (!(element instanceof HTMLElement && commentList instanceof HTMLElement)) {
      throw new Error('Element is not an HTMLElement');
    }
    this.commentList = commentList;
    this.value = { author: { name: '' }, name: '', text: '', date: '', likes: 0, isLiked: false };
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
  onToggleForm() {
    this.element.style.display = this.element.style.display === 'none' ? 'flex' : 'none';
  }
  onToggleList() {
    this.commentList.style.display = this.commentList.style.display === 'none' ? 'flex' : 'none';
  }
  onSubmit() {
    if (!this.isValid) return;
    this.value.date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
    showMessage('Комментарий добавляется...', true, this.commentList);
    this.button.setAttribute('disabled', true);
    this.element.style.display = 'none';
    sendComment((data) => {
      if (data) {
        commentsArray.push(this.value);
        const newComment = new Comment(this.value).render();
        this.commentList.appendChild(newComment);
        this.reset();
        this.input.focus();
      }
      this.element.style.display = 'flex';
      this.button.removeAttribute('disabled');
      showMessage(null, false, this.commentList);
    }, this.value);
  }
  update() {
    this.input.value = this.value.author.name;
    this.textarea.value = this.value.text;
    this.isValid = this.value.author.name && this.value.text;
    this.disableBtn();
  }
  onChange() {
    this.value.author.name = this.input.value;
    this.value.name = this.input.value;
    this.value.text = this.textarea.value;
    this.isValid = this.value.author.name && this.value.text;
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
    this.value = { author: { name: '' }, name: '', text: '', date: '', likes: 0, isLiked: false };
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

const commentList = document.querySelector('.comments');
const commentForm = document.querySelector('.add-form');

export const commentFormClass = new CommentForm(commentForm, commentList);

export default CommentForm;
