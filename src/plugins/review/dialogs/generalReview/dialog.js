import constants from './../../infrastructure/constants';
import CommentForm from './../commentForm/commentForm';
import htmlMarkupProvider from './../../infrastructure/htmlMarkupProvider';
import Button from './../controls/button';
import dialogHtml from './dialog.html';

class Dialog{
    constructor(onExpansionChanged){
        this.isExpanded = false;
        this.commentForm = new CommentForm();
        this.onExpansionChanged=onExpansionChanged;
        this.$dialog = $(htmlMarkupProvider.getHtmlMarkup(dialogHtml));

        this.$dialog.find(constants.selectors.addCommentForm).replaceWith(this.commentForm.$element);

        new Button(this.$dialog, constants.selectors.commentsHeader).click(() => {
            this.toggleExpansion();
        });
    }

    show() {
        this.$dialog.appendTo(constants.selectors.body);
        this.commentForm.init();
    }

    toggleExpansion() {
        let isExpanded = this.$dialog.hasClass(constants.css.expanded);
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