import Control from './control';

export default class Button extends Control {
    constructor($parent, selector){
        super($parent, selector);
    }
    
    click(handler) {
        this.$control.click((e) => {
            e.preventDefault();
            e.stopPropagation();
            handler();
            return false;
        });
    }
}