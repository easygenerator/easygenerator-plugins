import constants from './../../infrastructure/constants';
import CommentForm from './../commentForm/commentForm';
import htmlMarkupProvider from './../../infrastructure/htmlMarkupProvider';
import controls from './../controls/controls';
import PopupPositioner from './../popupPositioner';
import elementReviewDialogHtml from './elementReviewDialog.html';
     
var ElementReviewDialog = function (reviewService) {
    var commentForm = new CommentForm(reviewService, hide),
        popupPositioner = new PopupPositioner(),
        $dialog = $(htmlMarkupProvider.getHtmlMarkup(elementReviewDialogHtml)),
        closeBtn = new controls.Button($dialog, constants.selectors.closeDialogBtn),
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

module.exports = ElementReviewDialog;