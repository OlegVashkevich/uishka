// Импортируем стили
import './styles/variables.scss'
import './styles/reset.scss'
import './styles/animations.scss'

// Импортируем компоненты
import './components/button/button.js'
import './components/card/card.js'

// Экспортируем классы компонентов
export { Button } from './components/button/button.js'
export { Card } from './components/card/card.js'

// Автоматическая инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  console.log('UIshka Library loaded!')
})