import constants from './../../infrastructure/constants';

export default class Control{
    constructor($parent, selector){
        this.$control = $parent.find(selector);
        this.isShown = true;
    }

    addClass(css) {
        this.$control.addClass(css);
    }

    removeClass(css) {
        this.$control.removeClass(css);
    }

    show() {
        this.$control.show();
        this.isShown = true;
    }
    
    hide() {
        this.$control.hide();
        this.isShown = false;
    }

    fadeOut() {
        this.$control.fadeOut(constants.css.fast);
        this.isShown = false;
    }

    fadeIn() {
        this.$control.fadeIn(constants.css.fast);
        this.isShown = true;
    }

    focus() {
        this.$control.focus();
    }

    disable() {
        this.$control.prop(constants.css.disabled, true);
        this.addClass(constants.css.disabled);
    }

    enable() {
        this.$control.prop(constants.css.disabled, false);
        this.removeClass(constants.css.disabled);
    }
}