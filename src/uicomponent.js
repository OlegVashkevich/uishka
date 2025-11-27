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
    this.init();

    // Сохраняем экземпляр с ссылкой на элемент
    this.constructor.instances.set(element, this);
  }

  // Абстрактный метод - должен быть реализован в наследниках
  init() {
    throw new Error('Method "init" must be implemented in derived class');
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