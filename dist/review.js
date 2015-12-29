(function (review) {
    'use strict';

    review.clientContext = {
        set: function (key, value) {
            localStorage.setItem(key, JSON.stringify(value));
            return value;
        },
        get: function (key) {
            return JSON.parse(localStorage.getItem(key));
        },
        remove: function (key) {
            localStorage.removeItem(key);
        }
    }

})(window.review = window.review || {});
(function (review) {
    'use strict';

    var constants = {};

    constants.patterns = {
        email: /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,15})+)$/
    };

    constants.clientContextKeys = {
        userName: 'usernameForReview',
        userMail: 'usermailForReview',
        reviewSpotHintShown: 'reviewSpotHintShown',
        reviewGeneralHintShown: 'reviewGeneralHintShown'
    };

    constants.css = {
        reviewable: 'reviewable',
        reviewSpot: 'review-spot',
        reviewSpotWrapper: 'review-spot-wrapper',

        reviewDialog: 'review-dialog',
        generalReviewDialog: 'general-review-dialog',
        elementReviewDialog: 'element-review-dialog',
        closeDialogBtn: 'close-dialog-btn',
        commentStatusMessage: 'comment-status-message',
        cancelBtn: 'cancel-btn',
        commentBtn: 'comment-btn',
        commentsHeader: 'comments-header',
        message: 'message',
        identifyUserWrapper: 'identify-user-wrapper',
        messageWrapper: 'message-wrapper',
        errorMessage: 'error-message',
        mailInput: 'email-input',
        nameInput: 'name-input',

        reviewHint: 'review-hint',
        reviewHintText: 'review-hint-text',
        reviewHitnBtn: 'review-hint-btn',
        spotReviewHint: 'spot-review-hint',
        generalReviewHint: 'general-review-hint',

        top: 'top',
        left: 'left',
        right: 'right',
        bottom: 'bottom',
        expanded: 'expanded',
        error: 'error',
        name: 'name',
        email: 'email',
        empty: 'empty',
        shown: 'shown'
    };

    constants.selectors = {
        reviewable: '.' + constants.css.reviewable,
        reviewSpot: '.' + constants.css.reviewSpot,
        reviewSpotWrapper: '.' + constants.css.reviewSpotWrapper,

        reviewDialog: '.' + constants.css.reviewDialog,
        closeDialogBtn: '.' + constants.css.closeDialogBtn,
        commentStatusMessage: '.' + constants.css.commentStatusMessage,
        cancelBtn: '.' + constants.css.cancelBtn,
        commentBtn: '.' + constants.css.commentBtn,
        commentsHeader: '.' + constants.css.commentsHeader,
        message: '.' + constants.css.message,
        identifyUserWrapper: '.' + constants.css.identifyUserWrapper,
        messageWrapper: '.' + constants.css.messageWrapper,
        errorMessage: '.' + constants.css.errorMessage,
        mailInput: '.' + constants.css.mailInput,
        nameInput: '.' + constants.css.nameInput,

        reviewHint: '.' + constants.css.reviewHint,
        reviewHintText: '.' + constants.css.reviewHintText,
        reviewHitnBtn: '.' + constants.css.reviewHitnBtn,

        name: '.' + constants.css.name,
        email: '.' + constants.css.email
    };

    review.constants = constants;

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.ReviewPlugin = function () {
        var spotsController = new review.ReviewSpotsController(),
            hintController = new review.ReviewHintController(),
            dialogController = null,
            plugin = {
                isFirstRender: true,
                courseId: null
            };

        function init(courseId) {
            if ($ === undefined) {
                throw 'Easygenerator review requires jQuery';
            }

            plugin.courseId = courseId;
            dialogController = new review.ReviewDialogController(courseId, hintController);
        }

        function render() {
            var spots = spotsController.renderSpots(onSpotClick);

            if (plugin.isFirstRender) {
                hintController.showHintsIfNeeded(spots);
                dialogController.showGeneralReviewDialog();
            }

            plugin.isFirstRender = false;
        }

        function onSpotClick($spot) {
            if (hintController.isSpotReviewHintShown()) {
                hintController.hideSpotReviewHint();
            } else {
                dialogController.showElementReviewDialog($spot);
            }
        }

        return {
            init: init,
            render: render
        };
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.PostCommentCommand = function (courseId) {
        function execute(message, username, useremail) {
            alert(courseId + message + username + useremail);
        }

        return {
            execute: execute
        };
    }

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.ReviewDialog = function (courseId, hintController) {
        var constants = review.constants,
            clientContext = review.clientContext,
            postCommentCommand = new review.PostCommentCommand(courseId),
            html = $.parseHTML('<div class="review-dialog"> <div class="comments-header" data-bind="click: toggleVisiblity"> <div class="comment-header-text">Leave a comment</div> <div class="comments-expander" data-bind="css: { \'collapsed\': !isExpanded(), \'expanded\': isExpanded() }"></div> </div> <button class="close-dialog-btn"></button> <form class="add-comment-form"> <div class="message-wrapper"> <div class="add-comment-form-title">Leave a comment</div> <div class="comment-text-block-wrapper"> <textarea class="comment-text-block message" placeholder="Type your comment here..."></textarea> </div> </div> <div class="identify-user-wrapper"> <div class="identify-user-title">Please idenitfy yourself</div> <div class="identify-user-row"> <input class="name-input" type="text"/> <label>Name</label> <span class="error-message name">Enter your name</span> </div> <div class="identify-user-row"> <input class="email-input" type="email"/> <label>Email</label> <span class="error-message email">Invalid email</span> </div> </div> <div class="comment-action-wrapper"> <div class="comment-status-message success" title="Comment was sent"> Comment was sent </div> <div class="comment-status-message fail" title="Comment was not sent"> Comment was not sent. <br /> Try again. </div> <div class="comment-actions"> <button title="Cancel" class="cancel-btn"> <span class="btn-title">Cancel</span> </button> <button title="Post comment" class="comment-btn"> <span class="btn-title">Post comment</span> </button> </div> </div> </form> </div>'),
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
            debugger;
            if (!controls.identifyForm.isShown) {
                if (controls.messageForm.messageField.getValue().trim().length === 0) {
                    controls.messageForm.messageField.setErrorMark();
                    return;
                }
            } else {
                if (!validateIdentifyUserForm()) {
                    return;
                }

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
(function (review) {
    'use strict';

    review.ReviewDialogController = function (courseId, hintController) {
        var constants = review.constants,
            elementReviewDialog = review.ReviewDialog(courseId, hintController);

        function showGeneralReviewDialog() {
            review.ReviewDialog(courseId, hintController).show($('body'), constants.css.generalReviewDialog);
        }

        function showElementReviewDialog($spot) {
            if (elementReviewDialog.isShown) {
                elementReviewDialog.hide();
            }

            elementReviewDialog.show($spot, constants.css.elementReviewDialog);
        }

        return {
            showGeneralReviewDialog: showGeneralReviewDialog,
            showElementReviewDialog: showElementReviewDialog
        };
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.ReviewHint = function (text, css) {
        var constants = review.constants,
            html = $.parseHTML('<div class="review-hint"> <div class="review-hint-text-wrapper"> <div class="review-hint-text"></div> </div> <div class="review-hint-action-wrapper"> <button class="review-hint-btn btn">Got it</button> </div> </div>'),
            $hint = $(html),
            hint = {
                 isShown: false,
                 show: show,
                 hide: hide
            };

        return hint;

        function show($parent, gotItHandler) {
            hint.isShown = true;
            $hint.appendTo($parent);
            $hint.addClass(css);
            $hint.find(constants.selectors.reviewHintText).text(text);
            $hint.find(constants.selectors.reviewHitnBtn).click(gotItHandler);
        }

        function hide() {
            hint.isShown = false;
            $hint.detach();
        }
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.ReviewHintController = function () {
        var constants = review.constants,
            clientContext = review.clientContext,
            spotReviewHint = new review.ReviewHint('Click on icon near elements to leave the comment.', constants.css.spotReviewHint + ' ' + constants.css.left),
            generalReviewHint = new review.ReviewHint('Click on the panel here to leave the general comment.', constants.css.generalReviewHint + ' ' + constants.css.bottom);

        function showSpotReviewHint($spot) {
            spotReviewHint.show($spot, function () {
                hideSpotReviewHint();
            });
        }

        function hideSpotReviewHint() {
            spotReviewHint.hide();
            clientContext.set(constants.clientContextKeys.reviewSpotHintShown, true);

            if (clientContext.get(constants.clientContextKeys.reviewGeneralHintShown) !== true) {
                showGeneralReviewHint();
            }
        }

        function showGeneralReviewHint() {
            generalReviewHint.show($('body'), function () {
                hideGeneralReviewHint();
            });
        }

        function hideGeneralReviewHint() {
            generalReviewHint.hide();
            clientContext.set(constants.clientContextKeys.reviewGeneralHintShown, true);
        }

        function isSpotReviewHintShown() {
            return spotReviewHint.isShown;
        }

        function isGeneralReviewHintShown() {
            return generalReviewHint.isShown;
        }

        function showHintsIfNeeded(spots) {
            if (spots.length > 0 && clientContext.get(constants.clientContextKeys.reviewSpotHintShown) !== true) {
                showSpotReviewHint(spots[0]);
            } else if (clientContext.get(constants.clientContextKeys.reviewGeneralHintShown) !== true) {
                showGeneralReviewHint();
            }
        }

        return {
            isSpotReviewHintShown: isSpotReviewHintShown,
            isGeneralReviewHintShown: isGeneralReviewHintShown,
            showSpotReviewHint: showSpotReviewHint,
            showGeneralReviewHint: showGeneralReviewHint,
            hideSpotReviewHint: hideSpotReviewHint,
            hideGeneralReviewHint: hideGeneralReviewHint,
            showHintsIfNeeded: showHintsIfNeeded
        };
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.ReviewSpotsController = function () {
        var constants = review.constants,
            spotMarkup = '<div class="review-spot-wrapper"> <div class="review-spot"></div> </div>';

        function renderSpots(clickHandler) {
            var spots = [];
            $(constants.selectors.reviewable).each(function () {
                var $spot = renderSpotOnElement($(this), clickHandler);
                if ($spot) {
                    spots.push($spot);
                }
            });

            return spots;
        }

        return {
            renderSpots: renderSpots
        };

        function renderSpotOnElement($element, clickHandler) {
            if ($element.children().find(constants.selectors.reviewSpot).length > 0)
                return;

            var $spotWrapper = $(spotMarkup);
            $spotWrapper.appendTo($element);

            if (clickHandler) {
                var $spot = $spotWrapper.find(constants.selectors.reviewSpot);
                $spot.click(function () {
                    clickHandler($spotWrapper);
                });
            }

            return $spotWrapper;
        }
    };

})(window.review = window.review || {});
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