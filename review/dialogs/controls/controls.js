  import constants from './../../infrastructure/constants';
    
    var controls = {
        Message: Message,
        Button: Button,
        TextField: TextField,
        Control: Control
    };

    function Message($parent, selector) {
        return controls.Control.call(this, $parent, selector);
    }

    function Button($parent, selector) {
        var control = controls.Control.call(this, $parent, selector),
            $control = control.$control;

        control.click = function (handler) {
            $control.click(function (e) {
                e.preventDefault();
                handler();
            });
        }

        return control;
    }

    function TextField($parent, selector) {
        var control = controls.Control.call(this, $parent, selector),
            $control = control.$control,
            $errorMessage = $control.nextAll(constants.selectors.errorMessage),
            onfocus = null;

        $control.change(onChange);
        $control.focus(function () {
            control.removeErrorMark();
            if (onfocus) {
                onfocus();
            }
        });

        control.onfocus = function (handler) {
            onfocus = handler;
        }

        control.getValue = function () {
            return $control.val();
        }

        control.setValue = function (value) {
            $control.val(value);
            onChange();
        }

        control.clear = function () {
            control.setValue('');
            control.removeErrorMark();
        }

        control.setErrorMark = function () {
            control.addClass(constants.css.error);
            $errorMessage.addClass(constants.css.shown);
        }

        control.removeErrorMark = function () {
            control.removeClass(constants.css.error);
            $errorMessage.removeClass(constants.css.shown);
        }

        function onChange() {
            control.removeErrorMark();
            if (control.getValue().length === 0) {
                control.addClass(constants.css.empty);
            } else {
                control.removeClass(constants.css.empty);
            }
        }

        return control;
    }

    function Control($parent, selector) {
        var $control = $parent.find(selector);

        var control = {
            isShown: true,
            show: show,
            hide: hide,
            focus: focus,
            addClass: addClass,
            removeClass: removeClass,
            fadeIn: fadeIn,
            fadeOut: fadeOut,
            disable: disable,
            enable: enable,
            $control: $control
        };

        return control;

        function addClass(css) {
            $control.addClass(css);
        }

        function removeClass(css) {
            $control.removeClass(css);
        }

        function show() {
            $control.show();
            control.isShown = true;
        }

        function hide() {
            $control.hide();
            control.isShown = false;
        }

        function fadeOut() {
            $control.fadeOut('fast');
            control.isShown = false;
        }

        function fadeIn() {
            $control.fadeIn('fast');
            control.isShown = true;
        }

        function focus() {
            $control.focus();
        }

        function disable() {
            $control.prop('disabled', true);
            addClass('disabled');
        }

        function enable() {
            $control.prop('disabled', false);
            removeClass('disabled');
        }
    }

module.exports = controls;