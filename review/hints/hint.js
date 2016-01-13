(function (review) {
    'use strict';

    review.Hint = function (text, css, gotItHandler) {
        var constants = review.constants,
            html = review.htmlMarkupProvider.getHtmlMarkup('{{reviewHint.html}}'),
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