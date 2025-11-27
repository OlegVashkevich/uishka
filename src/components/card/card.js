import './card.scss'

export class Card {
  constructor(element) {
    this.element = element
    this.init()
  }

  init() {
    // Можно добавить логику для карточки
    console.log('Card initialized', this.element)
  }
}

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-ui-card]').forEach(card => {
    new Card(card)
  })
})