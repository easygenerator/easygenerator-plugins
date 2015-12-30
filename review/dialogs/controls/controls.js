(function (review) {
    'use strict';

    review.controls = {
        Message: Message,
        Button: Button,
        TextField: TextField,
        Control: Control
    };

    function Message($parent, selector) {
        return review.controls.Control.call(this, $parent, selector);
    }

    function Button($parent, selector) {
        var control = review.controls.Control.call(this, $parent, selector),
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
        var control = review.controls.Control.call(this, $parent, selector),
            $control = control.$control,
            $errorMessage = $control.nextAll(review.constants.selectors.errorMessage);

        $control.change(onChange);
        $control.focus(function () {
            control.removeErrorMark();
        });

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
            control.addClass(review.constants.css.error);
            $errorMessage.addClass(review.constants.css.shown);
        }

        control.removeErrorMark = function () {
            control.removeClass(review.constants.css.error);
            $errorMessage.removeClass(review.constants.css.shown);
        }

        function onChange() {
            control.removeErrorMark();
            if (control.getValue().length === 0) {
                control.addClass(review.constants.css.empty);
            } else {
                control.removeClass(review.constants.css.empty);
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

        function focus() {
            $control.focus();
        }
    }

})(window.review = window.review || {});