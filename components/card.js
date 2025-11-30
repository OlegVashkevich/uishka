import{B as r}from"./base.js";const t="uishka";class a extends r{constructor(o){super(o),this.addReactiveProperty("title","."+t+"-card__title","textContent"),console.log("Card initialized",this.element)}}document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll("."+t+"-card").forEach(e=>{new a(e)})});export{a as C};
//# sourceMappingURL=card.js.map
