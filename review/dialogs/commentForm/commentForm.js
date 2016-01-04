(function (review) {
    'use strict';

    review.CommentForm = function (reviewService, closeHandler) {
        var constants = review.constants,
            clientContext = review.clientContext,
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
            controls.submitBtn.disable();
            reviewService.postComment(message, username, usermail)
                .done(function (response) {
                    switchToMessageForm();
                    controls.submitBtn.enable();
                    if (response) {
                        if (response.success) {
                            init();
                            controls.commentStatusMessage.success.fadeIn();
                        } else {
                            
                            controls.commentStatusMessage.fail.fadeIn();
                        }
                    }
                }).fail(function () {
                    controls.submitBtn.enable();
                    switchToMessageForm();
                    controls.commentStatusMessage.fail.fadeIn();
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
            controls.messageForm.messageField.onfocus(function () {
                controls.commentStatusMessage.fadeOut();
            });
        }

        function switchToIdentifyUserForm() {
            controls.identifyForm.nameField.clear();
            controls.identifyForm.mailField.clear();

            controls.messageForm.hide();
            controls.identifyForm.fadeIn();
        }

        function switchToMessageForm() {
            controls.identifyForm.hide();
            controls.messageForm.fadeIn();
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