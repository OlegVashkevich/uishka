/**
 * Класс карточки UI компонента
 * @extends UIComponent
 * @class
 * @classdesc Компонент карточки с реактивными свойствами для управления содержимым
 * 
 * @example
 * // Автоматическая инициализация при загрузке DOM
 * // <div class="uishka-card">
 * //   <h3 class="uishka-card__title">Заголовок</h3>
 * //   <div class="uishka-card__body">Тело карточки</div>
 * // </div>
 * 
 * @param {HTMLElement} element - DOM элемент карточки
 */
import './card.scss'
import { UIComponent } from '/src/uicomponent.js'

const PREFIX = 'uishka'

export class Card extends UIComponent {
    /**
     * Создает экземпляр карточки
     * @param {HTMLElement} element - DOM элемент карточки
     */
    constructor(element) {
        super(element);

        /**
         * Добавляет реактивное свойство для заголовка карточки
         * @type {ReactiveProperty}
         */
        this.addReactiveProperty('title', '.' + PREFIX + '-card__title', 'textContent');
        console.log('Card initialized', this.element);
    }
}

/**
 * Автоматическая инициализация всех карточек на странице
 * @listens DOMContentLoaded
 * @description Инициализирует все элементы с классом 'uishka-card' как компоненты Card
 * и добавляет реактивные свойства для различных частей карточки
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.' + PREFIX + '-card').forEach(card => {
        new Card(card)
    });
});