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
        patternEmail: /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,15})+)$/
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

        reviewHint: 'review-hint',
        reviewHintText: 'review-hint-text',
        reviewHitnBtn: 'review-hint-btn',
        spotReviewHint: 'spot-review-hint',
        generalReviewHint: 'general-review-hint'
    };

    constants.selectors = {
        reviewable: '.' + constants.css.reviewable,
        reviewSpot: '.' + constants.css.reviewSpot,
        reviewSpotWrapper: '.' + constants.css.reviewSpotWrapper,
        reviewDialog: '.' + constants.css.reviewDialog,

        reviewHint: '.' + constants.css.reviewHint,
        reviewHintText: '.' + constants.css.reviewHintText,
        reviewHitnBtn: '.' + constants.css.reviewHitnBtn
    };

    review.constants = constants;

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.ReviewPlugin = function () {
        var spotsController = new review.ReviewSpotsController();

        function init() {
            if ($ === undefined) {
                throw 'Easygenerator review requires jQuery';
            }
        }

        function render() {
            spotsController.renderSpots();
        }

        return {
            init: init,
            render: render
        };
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.ReviewHint = function (text, css) {
        var constants = review.constants;
        var html = $.parseHTML('<div class="review-hint"> <div class="review-hint-text"></div> <button class="review-hint-btn btn">Got it</button> </div>');
        var $hint = $(html);

        function show($parent, gotItHandler) {
            $hint.appendTo($parent);
            $hint.addClass(css);
            $hint.find(constants.selectors.reviewHintText).text(text);
            $hint.find(constants.selectors.reviewHitnBtn).click(gotItHandler);
        }

        function hide() {
            $hint.detach();
        }

        return {
            show: show,
            hide: hide
        };
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.ReviewHintController = function () {
        var constants = review.constants,
            clientContext = review.clientContext,
            spotReviewHint = new review.ReviewHint('Click on icon near elements to leave the comment.', constants.css.spotReviewHint),
            generalReviewHint = new review.ReviewHint('Click on icon near elements to leave the general comment.', constants.css.generalReviewHint);

        function showSpotReviewHint($spot) {
            spotReviewHint.show($spot, function () {
                hideSpotReviewHint();
            });
        }

        function hideSpotReviewHint() {
            spotReviewHint.hide();
            clientContext.set(constants.clientContextKeys.reviewSpotHintShown, true);
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

        return {
            showSpotReviewHint: showSpotReviewHint,
            showGeneralReviewHint: showGeneralReviewHint,
            hideSpotReviewHint: hideSpotReviewHint,
            hideGeneralReviewHint: hideGeneralReviewHint
        };
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.ReviewDialog = function () {
        var constants = review.constants;
        var html = $.parseHTML('<div class="review-dialog "> <form class="add-comment-form"> <div> </div> <textarea class="comment-text-block message" placeholder="Type your comment here"></textarea> <div class="identify-user-form"> <div class="identify-user-title">Please idenitfy yourself</div> <div class="identify-user-row"> <input type="text"/> <label>Name</label> <span class="error-message">Enter your name</span> </div> <div class="identify-user-row"> <input type="email"/> <label>Email</label> <span class="error-message">Invalid email</span> </div> </div> <div class="comment-action-wrapper"> <div class="comment-status-message success" title="Comment was sent"> Comment was sent </div> <div class="comment-status-message fail" title="Comment was not sent"> Comment was not sent. <br/> Try again. </div> <button title="Send" class="btn comment-btn blue round pull-right"> <span class="btn-title">Send</span> </button> </div> </form> </div>');
        var $dialog = $(html);

        function show($spot) {
            debugger;
            $dialog.appendTo($spot);
        }

        return {
            show: show
        };
    };

})(window.review = window.review || {});
(function (review) {
    'use strict';

    review.ReviewSpotsController = function () {
        var constants = review.constants,
            clientContext = review.clientContext,
            hintController = new review.ReviewHintController(),
            spotMarkup = '<div class="review-spot-wrapper"> <div class="review-spot"></div> </div>',
            spots = [];

        function renderSpots() {
            var isFirstLoad = spots.length === 0;
            $(constants.selectors.reviewable).each(function () {
                var $spot = renderSpotOnElement($(this));
                if ($spot) {
                    spots.push($spot);
                }
            });

            debugger;
            if (isFirstLoad && spots.length > 0) {
                if (clientContext.get(constants.clientContextKeys.reviewSpotHintShown) !== true) {
                    hintController.showSpotReviewHint(spots[0]);
                } else if (clientContext.get(constants.clientContextKeys.reviewGeneralHintShown) !== true) {
                    hintController.showGeneralReviewHint();
                }
            }
        }

        return {
            renderSpots: renderSpots
        };

        function renderSpotOnElement($element) {
            if ($element.children().find(constants.selectors.reviewSpot).length > 0)
                return;

            var $spot = $(spotMarkup);
            $spot.appendTo($element);
            return $spot;
            //$spot.click(function () {
            //    dialog.show($spot);
            //});
        }
    };

})(window.review = window.review || {});