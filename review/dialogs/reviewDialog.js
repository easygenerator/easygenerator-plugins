(function (review) {
    'use strict';

    review.ReviewDialog = function (courseId, hintController) {
        var constants = review.constants,
            clientContext = review.clientContext,
            postCommentCommand = new review.PostCommentCommand(courseId),
            html = $.parseHTML('{{reviewDialog.html}}'),
            $dialog = $(html),
            dialog = {
                show: show,
                isShown: false,
                hide: hide
            },
            controls = new review.ReviewDialogControls($dialog);

        subscribeOnEvents();
        return dialog;

        function show($parent, css) {
            $dialog.appendTo($parent);
            $dialog.addClass(css);
            clear();

            $dialog.show();
            dialog.isShown = true;
        }

        function hide() {
            $dialog.detach();
            dialog.isShown = false;
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
                showIdentifyUserForm();
                return;
            }

            var message = controls.messageForm.messageField.getValue().trim();
            postCommentCommand.execute(message, username, usermail);
        }

        function toggleSize() {
            var isExpanded = $dialog.hasClass(constants.css.expanded);
            $dialog.toggleClass(constants.css.expanded);

            if (!isExpanded) {
                clear();
                if (hintController.isGeneralReviewHintShown()) {
                    hintController.hideGeneralReviewHint();
                }
            }
        }

        function clear() {
            controls.commentStatusMessage.hide();
            showMessageForm();

            controls.messageForm.messageField.clear();
            controls.messageForm.messageField.focus();
        }

        function subscribeOnEvents() {
            controls.closeBtn.click(hide);
            controls.cancelBtn.click(hide);
            controls.submitBtn.click(submit);
            controls.expandCollapseBtn.click(toggleSize);
        }

        function showIdentifyUserForm() {
            controls.identifyForm.nameField.clear();
            controls.identifyForm.mailField.clear();

            controls.identifyForm.show();
            controls.messageForm.hide();
        }

        function showMessageForm() {
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