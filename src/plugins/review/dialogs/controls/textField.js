import Control from './control';
import constants from './../../infrastructure/constants';

export default class TextField extends Control {
    constructor($parent, selector) {
        super($parent, selector);
        this.$errorMessage = this.$control.nextAll(constants.selectors.errorMessage);
        this.onfocusHandler = null;

        this.$control.change(() => onChange(this));
        this.$control.focus(() => {
            this.removeErrorMark();
            if (this.onfocusHandler) {
                this.onfocusHandler();
            }
        });
    }

    onfocus(handler) {
        this.onfocusHandler = handler;
    }
    
    getValue() {
        return this.$control.val();
    }

    setValue(value) {
        this.$control.val(value);
        onChange(this);
    }

    clear() {
        this.setValue('');
        this.removeErrorMark();
    }

    setErrorMark() {
        this.addClass(constants.css.error);
        this.$errorMessage.addClass(constants.css.shown);
    }

    removeErrorMark() {
        this.removeClass(constants.css.error);
        this.$errorMessage.removeClass(constants.css.shown);
    }
}

function onChange(control) {
    control.removeErrorMark();
    if (control.getValue().length === 0) {
        control.addClass(constants.css.empty);
    } else {
        control.removeClass(constants.css.empty);
    }
}