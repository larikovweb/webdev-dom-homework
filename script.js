const _apiUrl = 'https://webdev-hw-api.vercel.app/api/v1/:yurii-larikov/comments';

const useHTTP = (method, url, func, body) => {
  fetch(url, {
    method: method,
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then(func);
};

let commentsArray = [];

const protectionInnerHTML = (text) => {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
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
  onSubmit() {
    if (!this.isValid) return;
    this.value.date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
    useHTTP(
      'POST',
      _apiUrl,
      (data) => {
        commentsArray = data.comments;
        const newComment = new Comment(this.value).render();
        this.commentList.appendChild(newComment);
        this.reset();
        this.input.focus();
      },
      this.value,
    );
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
class Comment {
  constructor(value) {
    this.value = value;
  }
  render() {
    return Comment.commentTemplate(this.value);
  }
}
Comment.commentTemplate = (value) => {
  console.log(value);
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
    commentClass.value.text = `> ${comment} \r\n ${name},`;
    commentClass.update();
    commentClass.input.focus();
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

const commentList = document.querySelector('.comments');
const commentForm = document.querySelector('.add-form');

const commentClass = new CommentForm(commentForm, commentList);
useHTTP('GET', _apiUrl, (data) => {
  commentsArray = data.comments;
  console.log(commentsArray);
  commentClass.renderComments();
});
