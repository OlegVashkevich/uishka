import './card.scss'
import { UIComponent } from '/src/uicomponent.js'

const PREFIX = 'uishka'

export class Card extends UIComponent {
  getPropertiesConfig() {
    return {
      body: {
        selector: `.${PREFIX}-card__body`,
        domProperty: 'innerHTML'
      },
      //через update и get для примера
      footer: {
        selector: `.${PREFIX}-card__footer`,
        get: (element) => element?.innerHTML || '',
        update: (element, value) => element.innerHTML = value
      },
      // Добавляйте новые свойства с кастомной логикой
    };
  }

  constructor(element) {
    super(element);
    console.log('Card initialized', this.element);
  }
}

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.'+ PREFIX +'-card').forEach(card => {
    new Card(card).addReactiveProperty('title', {
      selector: `.${PREFIX}-card__title`,
      domProperty: 'textContent'
    });
  });
});