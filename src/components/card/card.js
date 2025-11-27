import './card.scss'

const PREFIX = 'uishka'

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
  document.querySelectorAll('.'+ PREFIX +'-card').forEach(card => {
    new Card(card)
  })
})