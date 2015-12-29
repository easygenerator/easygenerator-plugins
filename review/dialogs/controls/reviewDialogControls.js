(function (review) {
    'use strict';

    review.ReviewDialogControls = function ($dialog) {
        var constants = review.constants,
            controls = {
                closeBtn: new Button(constants.selectors.closeDialogBtn),
                cancelBtn: new Button(constants.selectors.cancelBtn),
                submitBtn: new Button(constants.selectors.commentBtn),
                expandCollapseBtn: new Button(constants.selectors.commentsHeader),

                commentStatusMessage: new Message(constants.selectors.commentStatusMessage),

                messageForm: new MessageForm(),
                identifyForm: new IdentifyForm()
            };

        return controls;

        function MessageForm() {
            var control = Control.call(this, constants.selectors.messageWrapper);

            control.messageField = new TextField(constants.selectors.message);

            return control;
        }

        function IdentifyForm() {
            var control = Control.call(this, constants.selectors.identifyUserWrapper);

            control.nameField = new TextField(constants.selectors.nameInput);
            control.mailField = new TextField(constants.selectors.mailInput);
            control.nameErrorMessage = new Message(constants.selectors.errorMessage + constants.selectors.name);
            control.mailErrorMassage = new Message(constants.selectors.errorMessage + constants.selectors.email);

            return control;
        }

        function Message(selector) {
            return Control.call(this, selector);
        }

        function Button(selector) {
            var control = Control.call(this, selector),
                $control = control.$control;

            control.click = function (handler) {
                $control.click(function (e) {
                    e.preventDefault();
                    handler();
                });
            }

            return control;
        }

        function TextField(selector) {
            var control = Control.call(this, selector),
                $control = control.$control,
                $errorMessage = $control.nextAll(constants.selectors.errorMessage);

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

        function Control(selector) {
            var $control = $dialog.find(selector);

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
    }

})(window.review = window.review || {});