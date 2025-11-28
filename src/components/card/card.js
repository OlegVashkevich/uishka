import './card.scss'
import { UIComponent } from '/src/uicomponent.js'

const PREFIX = 'uishka'

export class Card extends UIComponent {
  constructor(element) {
    super(element)
    // Конфигурация свойств
    this._propertiesConfig = {
      title: {
        selector: `.${PREFIX}-card__title`,
        update: (element, value) => element.textContent = value,
        get: (element) => element?.textContent || ''
      },
      body: {
        selector: `.${PREFIX}-card__body`,
        update: (element, value) => element.innerHTML = value,
        get: (element) => element?.innerHTML || ''
      },
      footer: {
        selector: `.${PREFIX}-card__footer`,
        update: (element, value) => element.innerHTML = value,
        get: (element) => element?.innerHTML || ''
      },
      // Добавляйте новые свойства с кастомной логикой
    }
    
    // Инициализация реактивных свойств
    this._reactiveProperties = {}
    Object.keys(this._propertiesConfig).forEach(property => {
      this._reactiveProperties[property] = this.getInitialValue(property)
    })
    
    this.setupReactivity()

    console.log('Card initialized', this.element)
  }
  
  getInitialValue(property) {
    const config = this._propertiesConfig[property]
    const element = this.element.querySelector(config.selector)
    return config.get(element)
  }
  
  setupReactivity() {
    Object.keys(this._reactiveProperties).forEach(property => {
      Object.defineProperty(this, property, {
        get: () => this._reactiveProperties[property],
        set: (value) => {
          if (this._reactiveProperties[property] !== value) {
            this._reactiveProperties[property] = value
            this.updatePropertyInDOM(property, value)
          }
        }
      })
    })
  }
  
  updatePropertyInDOM(property, value) {
    const config = this._propertiesConfig[property]
    if (!config) return
    
    const element = this.element.querySelector(config.selector)
    if (element) {
      config.update(element, value)
    }
  }
  
  // Добавление новых свойств динамически
  addProperty(name, config) {
    this._propertiesConfig[name] = config
    this._reactiveProperties[name] = this.getInitialValue(name)
    
    // Переопределяем свойство
    Object.defineProperty(this, name, {
      get: () => this._reactiveProperties[name],
      set: (value) => {
        if (this._reactiveProperties[name] !== value) {
          this._reactiveProperties[name] = value
          this.updatePropertyInDOM(name, value)
        }
      }
    })
  }
}

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.'+ PREFIX +'-card').forEach(card => {
    new Card(card)
  })
})