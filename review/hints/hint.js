import HintPositioner from './hintPositioner';
import constants from './../infrastructure/constants';
import htmlMarkupProvider from './../infrastructure/htmlMarkupProvider';
import reviewHintHtml from './reviewHint.html';
    
var Hint = function (text, css, gotItHandler) {
    var html = htmlMarkupProvider.getHtmlMarkup(reviewHintHtml),
        $hint = $(html),
        $body = $(constants.selectors.body),
        hintPositioner = new HintPositioner(),
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

module.exports = Hint;