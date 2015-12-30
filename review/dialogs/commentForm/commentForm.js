(function (review) {
    'use strict';

    review.CommentForm = function (courseId, closeHandler) {
        var constants = review.constants,
            clientContext = review.clientContext,
            postCommentCommand = new review.PostCommentCommand(courseId),
            html = $.parseHTML('{{commentForm.html}}'),
            $commentForm= $(html),
            controls = new review.CommentFormControls($commentForm);

        subscribeOnEvents();
		
		return {
			$element: $commentForm,
			init: init
		};

        function hide() {    
			if(closeHandler){
				closeHandler();
			}
        }

        function submit() {
            if (!controls.identifyForm.isShown) {
                if (controls.messageForm.messageField.getValue().trim().length === 0) {
                    controls.messageForm.messageField.setErrorMark();
                    return;
                }
            }
            else {
                if (!validateIdentifyUserForm())
                    return;

                clientContext.set(constants.clientContextKeys.userName, controls.identifyForm.nameField.getValue().trim());
                clientContext.set(constants.clientContextKeys.userMail, controls.identifyForm.mailField.getValue().trim());
            }

            var username = clientContext.get(constants.clientContextKeys.userName),
                usermail = clientContext.get(constants.clientContextKeys.userMail);

            if (!username || !username.trim() || !usermail || !usermail.trim()) {
                switchToIdentifyUserForm();
                return;
            }

            var message = controls.messageForm.messageField.getValue().trim();
            postCommentCommand.execute(message, username, usermail)
                .done(function (response) {
                    if (response) {
                        if (response.success) {
                            init();
                            controls.commentStatusMessage.success.show();
                        } else {
                            switchToMessageForm();
                            controls.commentStatusMessage.fail.show();
                        }
                    }
                }).fail(function () {
                    switchToMessageForm();
                    controls.commentStatusMessage.fail.show();
                });
        }

        function init() {
            controls.commentStatusMessage.hide();
            switchToMessageForm();

            controls.messageForm.messageField.clear();
            controls.messageForm.messageField.focus();
        }

        function subscribeOnEvents() {
            controls.cancelBtn.click(hide);
            controls.submitBtn.click(submit);
        }

        function switchToIdentifyUserForm() {
            controls.identifyForm.nameField.clear();
            controls.identifyForm.mailField.clear();

            controls.identifyForm.show();
            controls.messageForm.hide();
        }

        function switchToMessageForm() {
            controls.identifyForm.hide();
            controls.messageForm.show();
        }

        function validateIdentifyUserForm() {
            var isValid = true;
            if (!isIdentifyFormNameValid()) {
                controls.identifyForm.nameField.setErrorMark();
                isValid = false;
            }

            if (!isIdentifyFormMailValid()) {
                controls.identifyForm.mailField.setErrorMark();
                isValid = false;
            }

            return isValid;
        }

        function isIdentifyFormNameValid() {
            var value = controls.identifyForm.nameField.getValue();
            return value && value.trim() && value.trim().length <= 254;
        }

        function isIdentifyFormMailValid() {
            var value = controls.identifyForm.mailField.getValue();
            return value && value.trim() && value.trim().length <= 254 && constants.patterns.email.test(value.trim());
        }
    }

})(window.review = window.review || {});