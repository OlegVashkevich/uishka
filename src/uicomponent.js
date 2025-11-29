// Базовый абстрактный класс для всех UI компонентов
export class UIComponent {
  // Хранилище всех экземпляров (общее для всех наследников)
  static instances = new Map();
  
  constructor(element) {
    if (this.constructor === UIComponent) {
      throw new Error('UIComponent is abstract and cannot be instantiated directly');
    }

    // Инициализируем instances если его еще нет
    if (!this.constructor.instances) {
      this.constructor.instances = new Map();
    }
    
    this.element = element;
    
    // Инициализация системы реактивных свойств
    this._propertiesConfig = this.getPropertiesConfig?.() || {};
    this._reactiveProperties = {};
    
    // Инициализируем реактивные свойства если есть конфигурация
    if (Object.keys(this._propertiesConfig).length > 0) {
      Object.keys(this._propertiesConfig).forEach(property => {
        this._reactiveProperties[property] = this.getInitialValue(property);
      });
      this.setupReactivity();
    }

    // Сохраняем экземпляр с ссылкой на элемент
    this.constructor.instances.set(element, this);
  }

  // Метод для создания конфигурации свойств (должен быть переопределен в наследниках)
  getPropertiesConfig() {
    return {};
  }
  
  // Создаем методы update и get на основе указанного свойства DOM
  createDOMethods(propertyName) {
    const config = this._propertiesConfig[propertyName];
    if (!config) return null;
    
    // Если указано свойство DOM элемента (textContent, innerHTML и т.д.)
    if (config.domProperty) {
      return {
        update: (element, value) => element[config.domProperty] = value,
        get: (element) => element?.[config.domProperty] || ''
      };
    }
    
    // Если переданы кастомные методы (обратная совместимость)
    if (config.update && config.get) {
      return {
        update: config.update,
        get: config.get
      };
    }
    
    return null;
  }
  
  getInitialValue(property) {
    const methods = this.createDOMethods(property);
    if (!methods) return '';
    
    const config = this._propertiesConfig[property];
    const element = this.element.querySelector(config.selector);
    return methods.get(element);
  }
  
  setupReactivity() {
    Object.keys(this._reactiveProperties).forEach(property => {
      Object.defineProperty(this, property, {
        get: () => this._reactiveProperties[property],
        set: (value) => {
          if (this._reactiveProperties[property] !== value) {
            this._reactiveProperties[property] = value;
            this.updatePropertyInDOM(property, value);
          }
        }
      });
    });
  }
  
  updatePropertyInDOM(property, value) {
    const methods = this.createDOMethods(property);
    if (!methods) return;
    
    const config = this._propertiesConfig[property];
    const element = this.element.querySelector(config.selector);
    if (element) {
      methods.update(element, value);
    }
  }
  
  // Добавление новых свойств динамически
  addReactiveProperty(name, config) {
    this._propertiesConfig[name] = config;
    this._reactiveProperties[name] = this.getInitialValue(name);
    
    // Переопределяем свойство
    Object.defineProperty(this, name, {
      get: () => this._reactiveProperties[name],
      set: (value) => {
        if (this._reactiveProperties[name] !== value) {
          this._reactiveProperties[name] = value;
          this.updatePropertyInDOM(name, value);
        }
      }
    });
  }

  // Общие методы для всех компонентов
  show() {
    this.element.style.display = '';
  }

  hide() {
    this.element.style.display = 'none';
  }

  enable() {
    this.element.disabled = false;
  }

  disable() {
    this.element.disabled = true;
  }

  // Статические методы (общие для всех наследников)
  static getInstance(element) {
    return this.instances?.get(element);
  }
  
  static getBySelector(selector) {
    const element = document.querySelector(selector);
    return element ? this.instances.get(element) : null;
  }
  
  static getAll() {
    return this.instances ? Array.from(this.instances.values()) : [];
  }

  // Уничтожение компонента
  destroy() {
    this.constructor.instances?.delete(this.element);
  }
}