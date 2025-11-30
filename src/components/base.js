/**
 * Базовый абстрактный класс для всех UI компонентов
 * @abstract
 */
export class Base {
    /**
     * Создает экземпляр UI компонента
     * @param {Element} element - DOM элемент, к которому привязывается компонент
     * @throws {Error} Если попытаться создать экземпляр Base напрямую
     */
    constructor(element) {
        if (this.constructor === Base) {
            throw new Error('Base is abstract and cannot be instantiated directly');
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

        // Сохраняем экземпляр
        this.constructor.instances.set(element, this);

        this.constructor.setupMutationSignal();
    }


    static setupMutationSignal() {
        this.globalObserver = new MutationObserver((mutations) => {
            // Быстрая проверка: есть ли вообще удаления?
            const hasRemovals = mutations.some(mutation => 
                mutation.removedNodes.length > 0
            );
            
            if (hasRemovals) {
                if (!this.instances || this.instances.size === 0) return;
                let cleanedCount = 0;
                for (const [element, instance] of this.instances) {
                    if (!document.body.contains(element)) {
                        instance.destroy();
                        cleanedCount++;
                    }
                }
                if (cleanedCount > 0) {
                    console.log(`Cleaned ${cleanedCount} orphaned instances`);
                }
            }
        });

        // МИНИМАЛЬНЫЕ настройки для нашей задачи
        this.globalObserver.observe(document.body, {
            childList: true,    // ← нужно для обнаружения удалений
            subtree: true,      // ← нужно для удалений внутри body
            attributes: false,  // ← не нужно
            characterData: false // ← не нужно
        });
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
        if (!this.reactive) {
            this.reactive = {};
        }
        // Находим целевой элемент один раз при инициализации
        const targetElement = !selector || selector === 'this' ?
            this.element :
            this.element.querySelector(selector);

        if (!targetElement) {
            console.warn(`Element not found for selector: ${selector}`);
            return this;
        }

        Object.defineProperty(this.reactive, name, {
            get: () => {
                switch (propertyType) {
                    case 'innerHTML':
                        return targetElement.innerHTML || '';
                    case 'textContent':
                        return targetElement.textContent || '';
                    default:
                        return targetElement.getAttribute(propertyType) || '';
                }
            },
            set: (value) => {
                switch (propertyType) {
                    case 'innerHTML':
                        return targetElement.innerHTML = value;
                    case 'textContent':
                        return targetElement.textContent = value;
                    default:
                        return targetElement.setAttribute(propertyType, value);
                }
            },
            enumerable: true,
            configurable: true
        });

        return this;
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
     * @returns {Base|null} Экземпляр компонента или null
     */
    static getInstance(element) {
        return this.instances?.get(element);
    }

    /**
     * Получает первый экземпляр компонента по CSS селектору
     * @param {string} selector - CSS селектор
     * @returns {Base|null} Экземпляр компонента или null
     */
    static getBySelector(selector) {
        const element = document.querySelector(selector);
        return element ? this.instances.get(element) : null;
    }

    /**
     * Получает все экземпляры компонентов по CSS селектору
     * @param {string} selector - CSS селектор
     * @returns {Base[]} Массив экземпляров компонентов
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
     * @returns {Base[]} Массив экземпляров
     */
    static getAll() {
        return this.instances ? Array.from(this.instances.values()) : [];
    }

    /**
     * Уничтожает компонент, удаляя его из хранилища экземпляров
     * отписки от наблюдателя
     */
    destroy() {
        this.constructor.instances?.delete(this.element);
    }

    /**
     * Замораживает объект, запрещая добавление новых свойств
     */
    freeze() {
        Object.seal(this);
        return this;
    }
}