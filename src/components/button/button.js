// Класс для работы с кнопками
import './button.scss'

const PREFIX = 'uishka'

import { UIComponent } from './../../uicomponent.js'

export class Button extends UIComponent {
  constructor(element) {
    // вызываем конструктор родителя
    super(element)
    
    // добавляем счетчик
    this.clickCount = 0
    this.text = this.element.textContent
  }

  init() {
    console.log('Button initialized', this.element)
    // Добавляем обработчик клика
    this.element.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(event) {
    
    if (this.element.disabled) return
    
    // Создаем кастомное событие
    this.clickCount++
    const uievent = new CustomEvent('ui-button-click', {
      detail: { 
        timestamp: Date.now(),
        component: this
      },
      bubbles: true
    })
    this.element.dispatchEvent(uievent)
  }
  // Показать загрузку
  loading() {
    this.text = this.element.textContent
    this.element.innerHTML = 'Загрузка...'
    this.disable()
  }

  // Вернуть исходный текст
  reset() {
    this.element.textContent = this.text
    this.enable()
  }
}

// Автоматическая инициализация всех кнопок с data-ui-button
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.'+ PREFIX +'-btn').forEach(button => {
    const Btn = new Button(button)
  })
})