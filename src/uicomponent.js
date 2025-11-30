/**
 * Базовый абстрактный класс для всех UI компонентов
 * @abstract
 */
export class UIComponent {
    /**
     * Map всех экземпляров компонентов (статическое, общее для всех наследников)
     * @type {Map<Element, UIComponent>}
     */
    static instances = new Map();

    /**
     * Создает экземпляр UI компонента
     * @param {Element} element - DOM элемент, к которому привязывается компонент
     * @throws {Error} Если попытаться создать экземпляр UIComponent напрямую
     */
    constructor(element) {
        if (this.constructor === UIComponent) {
            throw new Error('UIComponent is abstract and cannot be instantiated directly');
        }

        // Инициализируем instances если его еще нет у наследника
        if (!this.constructor.instances) {
            this.constructor.instances = new Map();
        }

        /**
         * DOM элемент компонента
         * @type {Element}
         */
        this.element = element;

        /**
         * Конфигурация реактивных свойств
         * @type {Object}
         * @private
         */
        this._propertiesConfig = {};

        /**
         * Хранилище значений реактивных свойств
         * @type {Object}
         * @private
         */
        this._reactiveProperties = {};

        // Сохраняем экземпляр
        this.constructor.instances.set(element, this);
    }

    /**
     * Добавляет реактивное свойство к компоненту
     * @param {string} name - Имя свойства
     * @param {string} selector - CSS селектор для поиска элемента в DOM этого компонента
     * @param {string} [propertyType='textContent'] - Тип свойства: 
     *        'textContent' | 'innerHTML' | имя атрибута (например: 'src', 'href', 'data-*')
     * @returns {this} Возвращает this для цепочки вызовов
     * @example
     * // Текстовое свойство
     * this.addReactiveProperty('title', '.card__title', 'textContent');
     * // HTML свойство
     * this.addReactiveProperty('content', '.card__content', 'innerHTML');
     * // Свойство-атрибут
     * this.addReactiveProperty('imageSrc', '.card__img', 'src');
     */
    addReactiveProperty(name, selector, propertyType = 'textContent') {
        this._propertiesConfig[name] = [selector, propertyType];
        this._reactiveProperties[name] = this._getInitialValue(name);

        Object.defineProperty(this, name, {
            get: () => this._reactiveProperties[name],
            set: (value) => {
                if (this._reactiveProperties[name] !== value) {
                    this._reactiveProperties[name] = value;
                    this._updatePropertyInDOM(name, value);
                }
            }
        });
        return this;
    }

    /**
     * Получает начальное значение свойства из DOM
     * @param {string} property - Имя свойства
     * @returns {string} Начальное значение
     * @private
     */
    _getInitialValue(property) {
        const config = this._propertiesConfig[property];

        if (Array.isArray(config)) {
            const [selector, propertyType] = config;
            // Если селектор пустой или null - используем сам элемент
            const element = !selector || selector === 'this' ? 
                this.element : 
                this.element.querySelector(selector);

            if (!element) return '';

            switch (propertyType) {
                case 'innerHTML':
                    return element.innerHTML || '';
                case 'textContent':
                    return element.textContent || '';
                default:
                    // Все остальные случаи считаем атрибутами
                    return element.getAttribute(propertyType) || '';
            }
        }

        return '';
    }

    /**
     * Обновляет значение свойства в DOM
     * @param {string} property - Имя свойства
     * @param {string} value - Новое значение
     * @private
     */
    _updatePropertyInDOM(property, value) {
        const config = this._propertiesConfig[property];
        if (!config) return;

        if (Array.isArray(config)) {
            const [selector, propertyType] = config;
            // Если селектор пустой или null - используем сам элемент
            const element = !selector || selector === 'this' ? 
                this.element : 
                this.element.querySelector(selector);
                
            if (!element) return;

            switch (propertyType) {
                case 'innerHTML':
                    element.innerHTML = value;
                    break;
                case 'textContent':
                    element.textContent = value;
                    break;
                default:
                    // Все остальные случаи считаем атрибутами
                    element.setAttribute(propertyType, value);
            }
        }
    }

    /**
     * Показывает компонент (убирает display: none)
     */
    show() {
        this.element.style.display = '';
    }

    /**
     * Скрывает компонент (устанавливает display: none)
     */
    hide() {
        this.element.style.display = 'none';
    }

    /**
     * Включает компонент (убирает атрибут disabled)
     */
    enable() {
        this.element.disabled = false;
    }

    /**
     * Отключает компонент (устанавливает атрибут disabled)
     */
    disable() {
        this.element.disabled = true;
    }

    /**
     * Получает экземпляр компонента по DOM элементу
     * @param {Element} element - DOM элемент
     * @returns {UIComponent|null} Экземпляр компонента или null
     */
    static getInstance(element) {
        return this.instances?.get(element);
    }

    /**
     * Получает первый экземпляр компонента по CSS селектору
     * @param {string} selector - CSS селектор
     * @returns {UIComponent|null} Экземпляр компонента или null
     */
    static getBySelector(selector) {
        const element = document.querySelector(selector);
        return element ? this.instances.get(element) : null;
    }

    /**
     * Получает все экземпляры компонентов по CSS селектору
     * @param {string} selector - CSS селектор
     * @returns {UIComponent[]} Массив экземпляров компонентов
     */
    static getAllBySelector(selector) {
        const elements = document.querySelectorAll(selector);
        const instances = [];

        elements.forEach(element => {
            const instance = this.instances.get(element);
            if (instance) {
                instances.push(instance);
            }
        });

        return instances;
    }

    /**
     * Получает все экземпляры компонента
     * @returns {UIComponent[]} Массив экземпляров
     */
    static getAll() {
        return this.instances ? Array.from(this.instances.values()) : [];
    }

    /**
     * Уничтожает компонент, удаляя его из хранилища экземпляров
     */
    destroy() {
        this.constructor.instances?.delete(this.element);
    }
}