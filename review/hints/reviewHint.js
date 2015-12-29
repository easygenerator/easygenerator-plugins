(function (review) {
    'use strict';

    review.ReviewHint = function (text, css) {
        var constants = review.constants,
            html = $.parseHTML('{{reviewHint.html}}'),
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