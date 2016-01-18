import constants from './../../infrastructure/constants';
import CommentForm from './../commentForm/commentForm';
import htmlMarkupProvider from './../../infrastructure/htmlMarkupProvider';
import controls from './../controls/controls';
import dialogHtml from './dialog.html';

class Dialog{
    constructor(onExpansionChanged){
        var that=this;
        this.isExpanded = false;
        this.commentForm = new CommentForm();
        this.onExpansionChanged=onExpansionChanged;
        this.$dialog = $(htmlMarkupProvider.getHtmlMarkup(dialogHtml));

        this.$dialog.find(constants.selectors.addCommentForm).replaceWith(this.commentForm.$element);

        var expandCollapseBtn = new controls.Button(this.$dialog, constants.selectors.commentsHeader);
        expandCollapseBtn.click(function(){
            that.toggleExpansion();
        });
    }

    show() {
        this.$dialog.appendTo(constants.selectors.body);
        this.commentForm.init();
    }

    toggleExpansion() {
        var isExpanded = this.$dialog.hasClass(constants.css.expanded);
        this.$dialog.toggleClass(constants.css.expanded);
        this.isExpanded = false;

        if (!isExpanded) {
            this.commentForm.init();
            this.isExpanded = true;
        }

        this.onExpansionChanged();
    }
}
     
export default Dialog;
//var GeneralReviewDialog = function (reviewService, onExpansionChanhed) {
//    var commentForm = new CommentForm(reviewService),
//        $dialog = $(htmlMarkupProvider.getHtmlMarkup(dialogHtml)),
//        expandCollapseBtn = new controls.Button($dialog, constants.selectors.commentsHeader),
//        dialog = {
//            show: show,
//            isExpanded: false,
//            toggleExpansion: toggleExpansion
//        };

//    $dialog.find(constants.selectors.addCommentForm).replaceWith(commentForm.$element);
//    expandCollapseBtn.click(toggleExpansion);

//    return dialog;

//    function show() {
//        $dialog.appendTo(constants.selectors.body);
//        commentForm.init();
//    }

//    function toggleExpansion() {
//        var isExpanded = $dialog.hasClass(constants.css.expanded);
//        $dialog.toggleClass(constants.css.expanded);
//        dialog.isExpanded = false;

//        if (!isExpanded) {
//            commentForm.init();
//            dialog.isExpanded = true;
//        }

//        onExpansionChanhed();
//    }
//};

//module.exports = GeneralReviewDialog;