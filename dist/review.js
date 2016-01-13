(function (review) {
    'use strict';

    review.ReviewPlugin = function () {
        var spotController = null,
            hintController = null,
            dialogController = null;

        function init(settings) {
            if ($ === undefined) {
                throw 'Easygenerator review requires jQuery';
            }

            if (!settings) {
                throw 'Failed to initialize review plugin. Settings are not defined.';
            }

            if (!settings.reviewApiUrl) {
                throw 'Failed to initialize review plugin. Review api url is invalid.';
            }

            if (!settings.courseId) {
                throw 'Failed to initialize review plugin. Course id is invalid.';
            }

            var reviewService = new review.ReviewService(settings.reviewApiUrl, settings.courseId);
            hintController = new review.HintController(),
            dialogController = new review.ReviewDialogController(reviewService, hintController),
            spotController = new review.SpotController(hintController, dialogController);

            var windowResizeTracker = new review.WindowResizeTracker();

            windowResizeTracker.track(function () {
                spotController.hideSpots();
                hintController.hideHints();
            }, function () {
                spotController.showSpots();
                hintController.showHintsIfNeeded();
                dialogController.updatePosition();
            });

            if (!settings.hideGeneralReviewDialog) {
                dialogController.showGeneralReviewDialog();
            }
        }

        function renderSpots() {
            spotController.renderSpots();
            hintController.showHintsIfNeeded();
        }

        return {
            init: init,
            renderSpots: renderSpots
        };
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.ReviewService = function (reviewApiUrl, courseId) {
        function postComment(message, username, useremail) {
            return $.ajax({
                url: getApiUrl('api/comment/create'),
                data: { courseId: courseId, text: message.trim(), createdByName: username.trim(), createdBy: useremail.trim() },
                type: 'POST'
            });
        }

        function getApiUrl(apiPath) {
            if (reviewApiUrl.indexOf('/', reviewApiUrl.length - 1) !== -1) {
                return reviewApiUrl + apiPath;
            }

            return reviewApiUrl + '/' + apiPath;
        }

        return {
            postComment: postComment
        };
    }

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.PopupPositioner = function () {
        var constants = review.constants,
            css = constants.css,
            margin = {
                x: 0,
                y: 0
            },
            positioner = new review.ElementPositioner(margin);

        function setPopupPosition($container, $popup) {
            positioner.cleanupPosition($popup);
            
            var horizontalPosition = positioner.getHorizontalPosition($container, $popup);
            $popup.addClass(horizontalPosition ? horizontalPosition : css.middle);

            var verticalPosition = positioner.getVerticalPosition($container, $popup);
            $popup.addClass(verticalPosition ? verticalPosition : css.bottom);
        }

        return {
            setPopupPosition: setPopupPosition
        };
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.ReviewDialogController = function (reviewService, hintController) {
        var constants = review.constants,
            elementReviewDialog = new review.ElementReviewDialog(reviewService),
            generalReviewDialog = new review.GeneralReviewDialog(reviewService, onGeneralReviewDialogExpansionChanged);

        function onGeneralReviewDialogExpansionChanged() {
            if (hintController.isGeneralReviewHintShown()) {
                hintController.hideGeneralReviewHint();
            }

            if (elementReviewDialog.isShown) {
                elementReviewDialog.hide();
            }
        }

        function showGeneralReviewDialog() {
            generalReviewDialog.show();
        }

        function showElementReviewDialog($spot) {
            if (generalReviewDialog.isExpanded) {
                generalReviewDialog.toggleExpansion();
            }

            if (elementReviewDialog.isShown) {
                var isShownForElement = elementReviewDialog.isShownForElement($spot);
                elementReviewDialog.hide();
                if (isShownForElement) {
                    return;
                }
            }

            elementReviewDialog.show($spot, constants.css.elementReviewDialog);
        }

        function updatePosition() {
            if (elementReviewDialog.isShown) {
                elementReviewDialog.updatePosition();
            }
        }

        return {
            showGeneralReviewDialog: showGeneralReviewDialog,
            showElementReviewDialog: showElementReviewDialog,
            updatePosition: updatePosition
        };
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.Hint = function (text, css, gotItHandler) {
        var constants = review.constants,
            html = review.htmlMarkupProvider.getHtmlMarkup('<div class="review-hint"> <div class="review-hint-text-wrapper"> <div class="review-hint-text"></div> </div> <div class="review-hint-action-wrapper"> <button class="review-hint-btn btn">{{gotIt}}</button> </div> </div>'),
            $hint = $(html),
            $body = $(constants.selectors.body),
            hintPositioner = new review.HintPositioner(),
            hint = {
                isShown: false,
                show: show,
                hide: hide,
                $element: $hint
            };

        $hint.addClass(css);
        $hint.find(constants.selectors.reviewHintText).text(text);
        $hint.find(constants.selectors.reviewHitnBtn).click(gotItHandler);

        return hint;

        function show($spot) {
            $hint.appendTo($body);
            if ($spot) {
                hintPositioner.updatePosition($spot, hint);
            }

            $hint.addClass(constants.css.shown);
            hint.isShown = true;
        }

        function hide() {
            if (!hint.isShown)
                return;

            $hint.removeClass(constants.css.shown);
            $hint.detach();
            hint.isShown = false;
        }
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.HintController = function () {
        var constants = review.constants,
            clientContext = review.clientContext,
            localizationService = window.plugins.localizationService,
            spotReviewHint = new review.Hint(localizationService.localize('elementReviewHint'), constants.css.spotReviewHint,
                function () {
                    hideSpotReviewHint();
                }),
            generalReviewHint = new review.Hint(localizationService.localize('generalReviewHint'), constants.css.generalReviewHint + ' ' + constants.css.top,
                function () {
                    hideGeneralReviewHint();
                });

        function showSpotReviewHint($spot) {
            spotReviewHint.show($spot);
        }

        function hideSpotReviewHint() {
            spotReviewHint.hide();
            clientContext.set(constants.clientContextKeys.reviewSpotHintShown, true);

            showHintsIfNeeded();
        }

        function showGeneralReviewHint() {
            generalReviewHint.show();
        }

        function hideGeneralReviewHint() {
            generalReviewHint.hide();
            clientContext.set(constants.clientContextKeys.reviewGeneralHintShown, true);

            showHintsIfNeeded();
        }

        function isSpotReviewHintShown() {
            return spotReviewHint.isShown;
        }

        function isGeneralReviewHintShown() {
            return generalReviewHint.isShown;
        }

        function showHintsIfNeeded() {
            if (generalReviewHint.isShown)
                return;

            if (spotReviewHint.isShown) {
                spotReviewHint.hide();
            }

            if (clientContext.get(constants.clientContextKeys.reviewSpotHintShown) !== true) {
                var $spots = $(constants.selectors.reviewSpotWrapper);
                if ($spots.length > 0) {
                    showSpotReviewHint($($spots[0]));
                    return;
                } 
            }

            if (clientContext.get(constants.clientContextKeys.reviewGeneralHintShown) !== true) {
                showGeneralReviewHint();
            }
        }

        function hideHints() {
            spotReviewHint.hide();
            generalReviewHint.hide();
        }

        return {
            isSpotReviewHintShown: isSpotReviewHintShown,
            isGeneralReviewHintShown: isGeneralReviewHintShown,
            showSpotReviewHint: showSpotReviewHint,
            showGeneralReviewHint: showGeneralReviewHint,
            hideSpotReviewHint: hideSpotReviewHint,
            hideGeneralReviewHint: hideGeneralReviewHint,
            showHintsIfNeeded: showHintsIfNeeded,
            hideHints: hideHints
        };
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.HintPositioner = function () {
        var constants = review.constants,
            css = constants.css,
            margin = {
                x: 6,
                y: 6
            },
            positioner = new review.ElementPositioner(margin);

        function updatePosition($contextElement, hint) {
            var $element = hint.$element;
            positioner.cleanupPosition($element);

            var horizontalPosition = positioner.getHorizontalPosition($contextElement, $element);
            if (horizontalPosition) {
                setCoordinates($contextElement, $element, horizontalPosition);
                $element.addClass(horizontalPosition);
                return;
            }

            var verticalPosition = positioner.getVerticalPosition($contextElement, $element);
            if (verticalPosition) {
                setCoordinates($contextElement, $element, verticalPosition);
                $element.addClass(verticalPosition);
                return;
            }

            hint.$element.addClass(css.bottom);
        }

        function setCoordinates($contextElement, $element, position) {
            var coordinates = getCoordinates($contextElement, $element, position);
            var styles = {
                left: coordinates.x,
                top: coordinates.y
            };

            $element.css(styles);
        }

        function getCoordinates($contextElement, $element, position) {
            var elementSize = {
                width: $element.outerWidth(),
                height: $element.outerHeight()
            };

            var containerSize = {
                width: $contextElement.width(),
                height: $contextElement.height()
            };

            var containerPosition = {
                x: $contextElement.offset().left,
                y: $contextElement.offset().top
            };

            if (position === css.right) {
                return {
                    x: containerPosition.x + containerSize.width + margin.x,
                    y: containerPosition.y + containerSize.height / 2 - elementSize.height / 2
                };
            }

            if (position === css.left) {
                return {
                    x: containerPosition.x - margin.x - elementSize.width,
                    y: containerPosition.y + containerSize.height / 2 - elementSize.height / 2
                };
            }

            if (position === css.top) {
                return {
                    x: containerPosition.x + containerSize.width / 2 - elementSize.width / 2,
                    y: containerPosition.y - margin.y - elementSize.height
                };
            }

            if (position === css.bottom) {
                return {
                    x: containerPosition.x + containerSize.width / 2 - elementSize.width / 2,
                    y: containerPosition.y + containerSize.height + margin.y
                };
            }

            return undefined;
        }

        return {
            updatePosition: updatePosition
        };
    };

})(window.review = window.review || {});
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
        addCommentForm: 'add-comment-form',

        reviewHint: 'review-hint',
        reviewHintText: 'review-hint-text',
        reviewHitnBtn: 'review-hint-btn',
        spotReviewHint: 'spot-review-hint',
        generalReviewHint: 'general-review-hint',

        top: 'top',
        left: 'left',
        right: 'right',
        bottom: 'bottom',
        middle: 'middle',
        expanded: 'expanded',
        error: 'error',
        name: 'name',
        email: 'email',
        empty: 'empty',
        shown: 'shown',
        success: 'success',
        fail: 'fail',
        disabled: 'disabled'
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
        addCommentForm: '.' + constants.css.addCommentForm,

        reviewHint: '.' + constants.css.reviewHint,
        reviewHintText: '.' + constants.css.reviewHintText,
        reviewHitnBtn: '.' + constants.css.reviewHitnBtn,

        name: '.' + constants.css.name,
        email: '.' + constants.css.email,
        success: '.' + constants.css.success,
        fail: '.' + constants.css.fail,

        body: 'body',
        iframe: 'iframe',
        img: 'img'
    };

    review.constants = constants;

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.SpotCollection = function () {
        var spotPositioner = new review.SpotPositioner(),
            constants = review.constants,
            data = {
                arr: [],
                maxId: 0
            };

        function addSpot($element) {
            var spotMarkup = review.htmlMarkupProvider.getHtmlMarkup('<div class="review-spot-wrapper"> <div class="review-spot"></div> </div>');
            var $spotWrapper = $(spotMarkup).appendTo(constants.selectors.body);
            $spotWrapper.hide();

            var id = data.maxId + 1;
            var spot = {
                id: id,
                $element: $spotWrapper,
                $contextElement: $element
            };
            data.arr.push(spot);
            data.maxId = id;

            spot.$contextElement.find(constants.selectors.img).one('load', updateSpotPositions);
            spot.$contextElement.find(constants.selectors.iframe).one('load', updateSpotPositions);

            spotPositioner.updatePosition(spot);
            $spotWrapper.fadeIn(200);

            return spot;
        }

        function updateSpotPositions() {
            data.arr.forEach(function (item) {
                spotPositioner.updatePosition(item);
            });
        }

        function getSpotById(id) {
            return data.arr.find(function (item) {
                return item.id === id;
            });
        }

        function filterSpots(ids) {
            var arr = data.arr.filter(function (item) {
                return ids.some(function (id) {
                    return item.id === id;
                });
            });

            data.arr.forEach(function (item) {
                if (arr.indexOf(item) === -1) {
                    item.$element.fadeOut(200, function () {
                        item.$element.detach();
                    });
                }
            });

            data.arr = arr;
        }

        function hideSpots() {
            data.arr.forEach(function (spot) {
                spot.$element.hide();
            });
        }

        function showSpots() {
            data.arr.forEach(function (spot) {
                spotPositioner.updatePosition(spot);
            });

            data.arr.forEach(function (spot) {
                spot.$element.show();
            });
        }

        return {
            arr: data.arr,
            addSpot: addSpot,
            getSpotById: getSpotById,
            filterSpots: filterSpots,
            hideSpots: hideSpots,
            showSpots: showSpots
        };

    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.SpotController = function (hintController, dialogController) {
        var constants = review.constants,
            spotCollection = new review.SpotCollection();

        function hideSpots() {
            spotCollection.hideSpots();
        }

        function showSpots() {
            spotCollection.showSpots();
        }

        return {
            hideSpots: hideSpots,
            showSpots: showSpots,
            renderSpots: renderSpots
        };

        function renderSpots() {
            var ids = [];

            $(constants.selectors.reviewable).each(function () {
                var $element = $(this);
                var spot = renderSpotOnElement($element);
                if (spot) {
                    ids.push(spot.id);
                }
            });

            spotCollection.filterSpots(ids);
        }

        function renderSpotOnElement($element) {
            var spotId = getReviewSpotIdAttachedToElement($element);
            if (spotId) {
                return spotCollection.getSpotById(spotId);
            }

            var spot = spotCollection.addSpot($element);

            var $spot = spot.$element.find(constants.selectors.reviewSpot);
            $spot.click(function () {
                onSpotClick(spot.$element);
            });

            $spot.data({ reviewSpotId: spot.id });
            $element.data({ reviewSpotId: spot.id });
            return spot;
        }

        function getReviewSpotIdAttachedToElement($element) {
            var data = $element.data();
            if (!data)
                return false;

            return data.reviewSpotId;
        }

        function onSpotClick($spot) {
            if (hintController.isSpotReviewHintShown()) {
                hintController.hideSpotReviewHint();
            } else {
                dialogController.showElementReviewDialog($spot);
            }
        }
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.SpotPositioner = function () {
        var margin = {
            x: 3,
            y: 10
        },
        size = {
            width: 32,
            height: 32
        },
        $windowContainer = $(window);

        function updatePosition(spot) {
            var position = getContextElementTopRightPosition(spot.$contextElement);

            position.x = fitsInOuterCornerHirizonatlly(position) ? position.x + margin.x : position.x - size.width;
            position.y = fitsInOuterCornerVertically(position) ? position.y + margin.y - size.width : position.y + margin.y;

            var styles = {
                left: position.x,
                top: position.y
            };

            spot.$element.css(styles);
        }

        function getContextElementTopRightPosition($contextElement) {
            var offset = $contextElement.offset();
            return {
                y: offset.top,
                x: offset.left + $contextElement.outerWidth()
            }
        }

        function fitsInOuterCornerHirizonatlly(position) {
            var windowWidth = $windowContainer.width();
            return windowWidth - position.x - size.width - margin.x > 0;
        }

        function fitsInOuterCornerVertically(position) {
            return position.y + margin.y - size.width > 0;
        }

        return {
            updatePosition: updatePosition
        };
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.CommentForm = function (reviewService, closeHandler) {
        var constants = review.constants,
            clientContext = review.clientContext,
            $commentForm = $(review.htmlMarkupProvider.getHtmlMarkup('<form class="add-comment-form"> <div class="message-wrapper"> <div class="add-comment-form-title">{{leaveYourComment}}</div> <textarea class="comment-text-block message" placeholder="{{typeYourCommentHere}}"></textarea> </div> <div class="identify-user-wrapper"> <div class="identify-user-title">{{identifyMessage}}</div> <div class="identify-user-row"> <input class="name-input" type="text" /> <label>{{name}}</label> <span class="error-message name">{{enterYourNameError}}</span> </div> <div class="identify-user-row"> <input class="email-input" type="email" /> <label>{{email}}</label> <span class="error-message email">{{enterValidEmailError}}</span> </div> </div> <div class="comment-action-wrapper"> <div class="comment-status-message success" title="{{commentWasSent}}">{{commentWasSent}}</div> <div class="comment-status-message fail" title="{{commentWasNotSent}}">{{commentWasNotSent}}<br />{{tryAgain}}</div> <div class="comment-actions"> <button title="{{cancel}}" class="cancel-btn">{{cancel}}</button> <button title="{{postComment}}" class="comment-btn">{{postComment}}</button> </div> </div> </form>')),
            controls = new review.CommentFormControls($commentForm);

        subscribeOnEvents();

        return {
            $element: $commentForm,
            init: init
        };

        function hide() {
            if (closeHandler) {
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
                            clear();
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
            clear();
            controls.messageForm.messageField.focus();
        }

        function clear() {
            controls.commentStatusMessage.hide();
            switchToMessageForm();

            controls.messageForm.messageField.clear();
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
(function (review) {
    'use strict';

    review.CommentFormControls = function ($dialog) {
        var constants = review.constants,
            controls = {
                cancelBtn: new Button(constants.selectors.cancelBtn),
                submitBtn: new Button(constants.selectors.commentBtn),

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
            $errorMessage = $control.nextAll(review.constants.selectors.errorMessage),
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

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.ElementReviewDialog = function (reviewService) {
        var constants = review.constants,
            commentForm = new review.CommentForm(reviewService, hide),
            popupPositioner = new review.PopupPositioner(),
            $dialog = $(review.htmlMarkupProvider.getHtmlMarkup('<div class="review-dialog element-review-dialog"> <button class="close-dialog-btn"></button> <form class="add-comment-form"> </form> </div>')),
            closeBtn = new review.controls.Button($dialog, constants.selectors.closeDialogBtn),
            dialog = {
                isShown: false,
                show: show,
                hide: hide,
                isShownForElement: isShownForElement,
                updatePosition: updatePosition,
                $parent: null
            };

        closeBtn.click(hide);
        $dialog.find(constants.selectors.addCommentForm).replaceWith(commentForm.$element);

        return dialog;

        function show($parent) {
            dialog.$parent = $parent;
            $dialog.finish().css({ opacity: 0 }).removeClass(constants.css.shown).show().appendTo($parent);
            updatePosition();

            commentForm.init();
            $dialog.fadeTo(50, 1, function () {
                $dialog.addClass(constants.css.shown);
            });
            //$dialog.addClass(constants.css.shown);

            dialog.isShown = true;
        }

        function hide() {
            $dialog.finish().fadeOut(50, function () {
                $dialog.removeClass(constants.css.shown);
                $dialog.detach();
            });

            dialog.isShown = false;
            dialog.$parent = null;
        }

        function updatePosition() {
            if (dialog.$parent ) {
                popupPositioner.setPopupPosition(dialog.$parent, $dialog);
            }
        }

        function isShownForElement($spot) {
            return $spot.find(constants.selectors.reviewDialog).length > 0;
        }
    };
})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.GeneralReviewDialog = function (reviewService, onExpansionChanhed) {
        var constants = review.constants,
            commentForm = new review.CommentForm(reviewService),
            $dialog = $(review.htmlMarkupProvider.getHtmlMarkup('<div class="review-dialog general-review-dialog"> <div class="comments-header"> <div class="comment-header-text">{{leaveGeneralComment}}</div> <div class="comments-expander"></div> </div> <form class="add-comment-form"> </form> </div>')),
            expandCollapseBtn = new review.controls.Button($dialog, constants.selectors.commentsHeader),
            dialog = {
                show: show,
                isExpanded: false,
                toggleExpansion: toggleExpansion
            };

        $dialog.find(constants.selectors.addCommentForm).replaceWith(commentForm.$element);
        expandCollapseBtn.click(toggleExpansion);

        return dialog;

        function show() {
            $dialog.appendTo(constants.selectors.body);
            commentForm.init();
        }

        function toggleExpansion() {
            var isExpanded = $dialog.hasClass(constants.css.expanded);
            $dialog.toggleClass(constants.css.expanded);
            dialog.isExpanded = false;

            if (!isExpanded) {
                commentForm.init();
                dialog.isExpanded = true;
            }

            onExpansionChanhed();
        }
    };
})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.ElementPositioner = function (margin) {
        var constants = review.constants,
            css = constants.css,
            elementSize = null,
            containerSize=null,
            $windowContainer = $(constants.selectors.body);

        function cleanupPosition($element) {
            $element.removeClass(css.top);
            $element.removeClass(css.bottom);
            $element.removeClass(css.left);
            $element.removeClass(css.right);
            $element.removeClass(css.middle);
        }

        // #region horizontal

        function getHorizontalPosition($contextElement, $element) {
            elementSize = {
                width: $element.outerWidth(),
                height: $element.outerWidth()
            };

            containerSize = {
                width: $contextElement.width(),
                height: $contextElement.height()
            };

            var preferredPosition = getPreferredHorizontalPosition($contextElement),
                fitsRight = fitsToRight($contextElement),
                fitsLeft = fitsToLeft($contextElement);

            if (preferredPosition === css.left && fitsLeft) {
                return css.left;
            }

            if (preferredPosition === css.right && fitsRight) {
                return css.right;
            }

            if (fitsLeft) {
                return css.left;
            }

            if (fitsRight) {
                return css.right;
            }

            return undefined;
        }

        function fitsToRight($contextElement) {
            var constainerX = $contextElement.offset().left;
            return ($windowContainer.width() - constainerX - containerSize.width - margin.x - elementSize.width) > 0;
        }

        function fitsToLeft($contextElement) {
            var constainerX = $contextElement.offset().left;
            return (constainerX - margin.x - elementSize.width) > 0;
        }

        function getPreferredHorizontalPosition($contextElement) {
            var constainerX = $contextElement.offset().left;
            return $windowContainer.width() / 2 - constainerX > 0 ? css.right : css.left;
        }

        // #endregion

        // #region vertical

        function getVerticalPosition($contextElement) {
            var preferredPosition = getPreferredVerticalPosition($contextElement),
                fitsTop = fitsToTop($contextElement),
                fitsBottom = fitsToBottom($contextElement);

            if (preferredPosition === css.top && fitsTop) {
                return css.top;
            }

            if (preferredPosition === css.bottom && fitsBottom) {
                return css.bottom;
            }

            if (fitsTop) {
                return css.top;
            }

            if (fitsBottom) {
                return css.bottom;
            }

            return undefined;
        }

        function fitsToBottom($contextElement) {
            var constainerY = $contextElement.offset().top;
            return ($windowContainer.height() - constainerY - containerSize.height - margin.y - elementSize.height) > 0;
        }

        function fitsToTop($contextElement) {
            var constainerY = $contextElement.offset().top;
            return (constainerY - margin.y - elementSize.height) > 0;
        }

        function getPreferredVerticalPosition($contextElement) {
            var constainerY = $contextElement.offset().top;
            return $windowContainer.height() / 2 - constainerY > 0 ? css.bottom : css.top;
        }

        // #endregion

        return {
            cleanupPosition: cleanupPosition,
            getHorizontalPosition: getHorizontalPosition,
            getVerticalPosition: getVerticalPosition
        };
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.htmlMarkupProvider = {
        getHtmlMarkup: function (html) {
            var localizationService = window.plugins.localizationService;
            return $.parseHTML(localizationService.localizeHtml(html));
        }
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.WindowResizeTracker = function () {
        function track(resizeStartedHandler, resizeFinishedHandler) {
            var rtime;
            var timeout = false;
            var delta = 200;
            $(window).resize(function () {
                resizeStartedHandler();
                rtime = new Date();
                if (timeout === false) {
                    timeout = true;
                    setTimeout(resizeend, delta);
                }
            });

            function resizeend() {
                if (new Date() - rtime < delta) {
                    setTimeout(resizeend, delta);
                } else {
                    timeout = false;
                    resizeFinishedHandler();
                }
            }
        }

        return {
            track: track
        };
    };

})(window.review = window.review || {});
(function (plugins) { plugins.lang ={"cn":{"commentWasNotSent":"评论没有发送","commentWasSent":"评论已发送","leaveYourComment":"发表评论","send":"发布评论","tryAgain":"重试","yourMessage":"输入您的消息...","identifyMessage":"请填写您自己的相关信息","name":"姓名","email":"电子邮件","enterValidEmailError":"输入有效电子邮件","enterYourNameError":"输入您的姓名","gotIt":"Got it","elementReviewHint":"Click on icon near elements to leave the comment.","generalReviewHint":"Click on the panel here to leave the general comment.","leaveGeneralComment":"Leave general comment","typeYourCommentHere":"Type your comment here...","cancel":"Cancel","postComment":"Post comment"},"de":{"commentWasNotSent":"Der Kommentar wurde nicht gesendet.","commentWasSent":"Der Kommentar wurde gesendet.","leaveYourComment":"Kommentieren Sie diesen Beitrag","send":"Kommentar posten","tryAgain":"Versuchen Sie es erneut.","yourMessage":"Ihre Nachricht tippen ...","identifyMessage":"Bitte identifizieren Sie sich","name":"Name","email":"E-Mail","enterValidEmailError":"Geben Sie eine gültige E-Mail ein","enterYourNameError":"Geben Sie Ihren Namen ein","gotIt":"Got it","elementReviewHint":"Click on icon near elements to leave the comment.","generalReviewHint":"Click on the panel here to leave the general comment.","leaveGeneralComment":"Leave general comment","typeYourCommentHere":"Type your comment here...","cancel":"Cancel","postComment":"Post comment"},"en":{"commentWasNotSent":"Comment was not sent.","commentWasSent":"Comment was sent","leaveYourComment":"Leave your comment","send":"Post comment","tryAgain":"Try again","yourMessage":"Type your message...","identifyMessage":"Please identify yourself","name":"Name","email":"E-mail","enterValidEmailError":"Enter a valid e-mail","enterYourNameError":"Enter a valid name","gotIt":"Got it","elementReviewHint":"Click on icon near elements to leave the comment.","generalReviewHint":"Click on the panel here to leave the general comment.","leaveGeneralComment":"Leave general comment","typeYourCommentHere":"Type your comment here...","cancel":"Cancel","postComment":"Post comment"},"es":{"commentWasNotSent":"El comentario no fue enviado.","commentWasSent":"El comentario fue enviado","leaveYourComment":"Deje su comentario","send":"Publicar comentario","tryAgain":"Intentar de nuevo","yourMessage":"Escriba el mensaje...","identifyMessage":"Identifíquese","name":"Nombre","email":"Dirección de correo electrónico","enterValidEmailError":"Introduzca una dirección de correo electrónico válida","enterYourNameError":"Introduzca un nombre válido","gotIt":"Got it","elementReviewHint":"Click on icon near elements to leave the comment.","generalReviewHint":"Click on the panel here to leave the general comment.","leaveGeneralComment":"Leave general comment","typeYourCommentHere":"Type your comment here...","cancel":"Cancel","postComment":"Post comment"},"fr":{"commentWasNotSent":"Le commentaire n'a pas été envoyé.","commentWasSent":"Le commentaire a été envoyé","leaveYourComment":"Laissez votre commentaire","send":"Publiez le commentaire","tryAgain":"Réessayer","yourMessage":"Saisissez votre message...","identifyMessage":"Veuillez vous identifier","name":"Nom","email":"Adresse email","enterValidEmailError":"Veuillez saisir une adresse email valide","enterYourNameError":"Veuillez saisir votre nom","gotIt":"Got it","elementReviewHint":"Click on icon near elements to leave the comment.","generalReviewHint":"Click on the panel here to leave the general comment.","leaveGeneralComment":"Leave general comment","typeYourCommentHere":"Type your comment here...","cancel":"Cancel","postComment":"Post comment"},"nl":{"commentWasNotSent":"Opmerking niet verzonden","commentWasSent":"Opmerking verzonden","leaveYourComment":"Geef uw mening","send":"Plaats opmerking","tryAgain":"Probeer opnieuw","yourMessage":"Typ uw bericht","identifyMessage":"Vul uw gegevens in","name":"Naam","email":"Email","enterValidEmailError":"Vul een correct emailadres in","enterYourNameError":"Vul een geldige naam in","gotIt":"Got it","elementReviewHint":"Click on icon near elements to leave the comment.","generalReviewHint":"Click on the panel here to leave the general comment.","leaveGeneralComment":"Leave general comment","typeYourCommentHere":"Type your comment here...","cancel":"Cancel","postComment":"Post comment"},"pt_br":{"commentWasNotSent":"Comentário não foi enviado.","commentWasSent":"Comentário foi enviado","leaveYourComment":"Deixe seu comentário","send":"Postar comentário","tryAgain":"Tente novamente","yourMessage":"Digite sua mensagem...","identifyMessage":"Identifique-se","name":"Nome","email":"Email","enterValidEmailError":"Insira um email válido","enterYourNameError":"Insira seu nome","gotIt":"Got it","elementReviewHint":"Click on icon near elements to leave the comment.","generalReviewHint":"Click on the panel here to leave the general comment.","leaveGeneralComment":"Leave general comment","typeYourCommentHere":"Type your comment here...","cancel":"Cancel","postComment":"Post comment"},"ua":{"commentWasNotSent":"Коментар не був відправлений.","commentWasSent":"Відправлено","leaveYourComment":"Залиште свій коментар","send":"Відправити коментар","tryAgain":"Спробувати знову","yourMessage":"Напишіть Ваше повідомлення...","identifyMessage":"Будь-ласка, ідентифікуйте себе","name":"Ім'я","email":"E-mail","enterValidEmailError":"Введіть валідний e-mail","enterYourNameError":"Введіть своє ім'я","gotIt":"Зрозуміло","elementReviewHint":"Натисніть на іконку щоб залишити коментар","generalReviewHint":"Натисніть на панель щоб залишити загальний коментар","leaveGeneralComment":"Залиште загальний коментар","typeYourCommentHere":"Ваш коментар...","cancel":"Відміна","postComment":"Відіслати коментар"}};})(window.plugins = window.plugins || {});
(function (plugins) {
    'use strict';

    var LocalizationService = function () {
        var service = {
            locale: 'en'
        };

        function init(locale) {
            if (!plugins.lang) {
                throw 'Plugins lang is not initialized';
            }

            service.locale = locale;
            var lang = plugins.lang[service.locale];
            if (!lang) {
                service.locale = 'en';
            }
        }

        function localize(key) {
            return plugins.lang[service.locale][key];
        }

        function localizeHtml(html) {
            var regExp = /\{\{(.*?)\}\}/gi;
            var result = '', localizedHtml = html;
            while ((result = regExp.exec(localizedHtml)) !== null) {
                var match = result[0],
                    key = result[1];

                localizedHtml = localizedHtml.replace(match, localize(key));
            }

            return localizedHtml;
        }

        return {
            init: init,
            localize: localize,
            localizeHtml: localizeHtml
        };
    };

    plugins.localizationService = new LocalizationService();

})(window.plugins = window.plugins || {});