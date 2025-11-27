import './card.scss'
import { UIComponent } from './../../uicomponent.js'

const PREFIX = 'uishka'

export class Card extends UIComponent {
  constructor(element) {
    super(element)
    // Можно добавить логику для карточки
    console.log('Card initialized', this.element)
  }
}

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.'+ PREFIX +'-card').forEach(card => {
    new Card(card)
  })
})