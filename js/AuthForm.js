import { registerUser, loginUser } from './api.js';
import { commentFormClass } from './CommentForm.js';
import { token } from './data.js';

export class AuthForm {
  constructor(element) {
    if (!(element instanceof HTMLElement)) {
      throw new Error('Element is not an HTMLElement');
    }
    this.element = element;
    this.value = {};
    this.isValid = false;
    this.inputLogin = this.element.querySelector('input[name="login"]');
    this.inputName = this.element.querySelector('input[name="name"]');
    this.inputPassword = this.element.querySelector('input[name="password"]');
    this.button = this.element.querySelector('button');
    this.link = this.element.querySelector('a');
    this.type = 'log';

    this.button.addEventListener('click', this.onSubmit.bind(this));
    this.inputLogin.addEventListener('input', this.onChange.bind(this));
    this.inputName.addEventListener('input', this.onChange.bind(this));
    this.inputPassword.addEventListener('input', this.onChange.bind(this));
    this.link.addEventListener('click', this.toggleType.bind(this));
  }
  onToggleForm() {
    this.element.style.display = this.element.style.display === 'none' ? 'flex' : 'none';
    commentFormClass.onToggleList();
  }
  onSubmit() {
    if (!this.isValid) return;
    if (this.type === 'reg') {
      registerUser((data) => {
        token.push(data.user.token);
        commentFormClass.onToggleForm();
        this.onToggleForm();
      }, this.value);
    } else {
      loginUser((data) => {
        token.push(data.user.token);
        commentFormClass.onToggleForm();
        this.onToggleForm();
      }, this.value);
    }
  }
  toggleType(e) {
    e.preventDefault();
    this.type = this.type === 'reg' ? 'login' : 'reg';
    this.link.textContent = this.type === 'reg' ? 'Авторизоваться' : 'Нет аккаунта?';
    if (this.type === 'reg') {
      this.inputName.style.display = 'block';
      this.inputName.focus();
    } else {
      this.inputName.style.display = 'none';
      this.inputLogin.focus();
    }
    this.value = {};
    this.inputLogin.value = '';
    this.inputName.value = '';
    this.inputPassword.value = '';
    this.disableBtn();
  }
  onChange() {
    this.value.login = this.inputLogin.value;
    this.value.password = this.inputPassword.value;
    if (this.type === 'reg') {
      this.value.name = this.inputName.value;
      this.isValid = this.value.login && this.value.name && this.value.password;
    } else {
      this.isValid = this.value.login && this.value.password;
    }
    this.disableBtn();
  }
  disableBtn() {
    this.isValid
      ? this.button.removeAttribute('disabled')
      : this.button.setAttribute('disabled', true);
  }
}

export const formAuthClass = new AuthForm(document.querySelector('.auth-form'));
