// Класс для работы с кнопками
import './button.scss'

import { UIComponent } from './../../uicomponent.js'

export class Button extends UIComponent {
  constructor(element) {
    // вызываем конструктор родителя
    super(element)
    
    // добавляем счетчик
    this.clickCount = 0
  }

  init() {
    console.log('init');
    // Добавляем обработчик клика
    this.element.addEventListener('click', this.handleClick.bind(this));
    this.element.classList.add('ui-button');
  }

  handleClick(event) {
    
    if (this.element.disabled) return
    
    // Создаем кастомное событие
    this.clickCount++
    const uievent = new CustomEvent('ui-button-click', {
      detail: { 
        element: this.element,
        timestamp: Date.now(),
        component: this
      },
      bubbles: true
    })
    this.element.dispatchEvent(uievent)
  }
  /*
  // Включить кнопку
  enable() {
    this.element.disabled = false
  }

  // Выключить кнопку
  disable() {
    this.element.disabled = true
  }
  */
  // Показать загрузку
  loading() {
    this.element.innerHTML = 'Загрузка...'
    this.element.disabled = true
  }

  // Вернуть исходный текст
  reset(text = null) {
    if (text) this.element.textContent = text
    this.element.disabled = false
  }
}

// Автоматическая инициализация всех кнопок с data-ui-button
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-ui-button]').forEach(button => {
    const Btn = new Button(button)
  })
})