import constants from './../../infrastructure/constants';
import CommentForm from './../commentForm/commentForm';
import htmlMarkupProvider from './../../infrastructure/htmlMarkupProvider';
import controls from './../controls/controls';
import generalReviewDialogHtml from './generalReviewDialog.html';
     
var GeneralReviewDialog = function (reviewService, onExpansionChanhed) {
    var commentForm = new CommentForm(reviewService),
        $dialog = $(htmlMarkupProvider.getHtmlMarkup(generalReviewDialogHtml)),
        expandCollapseBtn = new controls.Button($dialog, constants.selectors.commentsHeader),
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

module.exports = GeneralReviewDialog;