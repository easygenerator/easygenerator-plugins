(function (review) {
    'use strict';

    review.CommentFormControls = function ($dialog) {
        var constants = review.constants,
            controls = {
                //closeBtn: new Button(constants.selectors.closeDialogBtn),
                cancelBtn: new Button(constants.selectors.cancelBtn),
                submitBtn: new Button(constants.selectors.commentBtn),
                //expandCollapseBtn: new Button(constants.selectors.commentsHeader),

                commentStatusMessage: new CommentStatusMessage(),

                messageForm: new MessageForm(),
                identifyForm: new IdentifyForm()
            };

        return controls;

        function CommentStatusMessage() {
            var control = Control.call(this, constants.selectors.commentStatusMessage);

            control.success = new Message(constants.selectors.commentStatusMessage + constants.selectors.success);
            control.fail = new Message(constants.selectors.commentStatusMessage + constants.selectors.fail);

            return control;
        }

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
            return new review.controls.Message($dialog, selector);
        }

        function Button(selector) {
            return new review.controls.Button($dialog, selector);
        }

        function TextField(selector) {
            return new review.controls.TextField($dialog, selector);
        }

        function Control(selector) {
            return new review.controls.Control($dialog, selector);
        }
    }

})(window.review = window.review || {});