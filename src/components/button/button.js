import './button.scss'
import { Base } from '../base.js'

const PREFIX = 'uishka'

export class Button extends Base {
    static selector = '.' + PREFIX + '-btn';
    constructor(element) {
        super(element);

        // добавляем счетчик
        this.clickCount = 0;
        this.text = this.element.textContent;

        // Добавляем обработчик клика
        //this.element.addEventListener('click', this.handleClick.bind(this));
        //this.on(this.element, 'click', this.handleClick);
        // С обработчиком и данными
        this.emitOn(this.element, 'click', 'click-clack', {
            handler: (event) => {
                this.clickCount++;
                console.log('Клик зарегистрирован');
            },
            detail: { buttonType: 'primary' },
            bubbles: true
        });
    }

    /*handleClick(event) {
        if (this.element.disabled) return;

        // Создаем кастомное событие
        this.clickCount++;

        this.emit('click-clack');
    }*/

    // Показать загрузку
    loading() {
        this.text = this.element.textContent;
        this.element.innerHTML = 'Загрузка...';
        this.disable();
    }

    // Вернуть исходный текст
    reset() {
        this.element.textContent = this.text;
        this.enable();
    }
}

// Автоматическая инициализация всех кнопок с data-ui-button
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(Button.selector).forEach(button => {
        new Button(button);
    });
});