import constants from './../../infrastructure/constants';
import CommentForm from './../commentForm/commentForm';
import htmlMarkupProvider from './../../infrastructure/htmlMarkupProvider';
import Button from './../controls/button';
import DialogPositioner from './dialogPositioner';
import dialogHtml from './dialog.html';

export default class Dialog{
    constructor(){
        this.isShown = false;
        this.$html = $(constants.selectors.html);
        this.dialogPositioner = new DialogPositioner();
        this.$dialog = $(htmlMarkupProvider.getHtmlMarkup(dialogHtml));
        this.commentForm =  new CommentForm(() => {
            this.hide();
        });

        new Button(this.$dialog, constants.selectors.closeDialogBtn).click(() => {
            this.hide();
        });

        this.$dialog.addClass(constants.css.elementReviewDialog).find(constants.selectors.addCommentForm).replaceWith(this.commentForm.$element);
        this.hideOnEscapeProxy = this.hideOnEscape.bind(this);
        this.detachProxy = this.detach.bind(this);
        this.updatePositionProxy = this.updatePosition.bind(this);
    }

    show($parent) {
        this.$parent = $parent;
        this.$dialog.finish().css({ opacity: 0 }).removeClass(constants.css.shown).show().appendTo($parent);
        this.updatePosition();

        this.commentForm.init();
        this.$dialog.fadeTo(50, 1, () => {
            this.$dialog.addClass(constants.css.shown);
        });

        $parent.on(constants.events.elementShown, this.updatePositionProxy);
        $parent.on(constants.events.elementDestroyed, this.detachProxy);

        this.$html.on(constants.events.keyUp,  this.hideOnEscapeProxy);

        this.isShown = true;
    }

    hideOnEscape(evt){
        if (evt.keyCode === 27) {
            this.hide();
        }
    }

    hide() {
        this.$dialog.finish().fadeOut(50, () => {
            this.$dialog.removeClass(constants.css.shown);
            this.$dialog.detach();
        });

        this.$parent.off(constants.events.elementShown, this.updatePositionProxy);
        this.$parent.off(constants.events.elementDestroyed, this.detachProxy);

        this.$html.off(constants.events.keyUp, this.hideOnEscapeProxy);

        this.isShown = false;
        this.$parent = null;
    }

    updatePosition() {
        this.dialogPositioner.setPosition(this.$parent, this.$dialog);
    }

    isShownForElement($spot) {
        return $spot.find(constants.selectors.reviewDialog).length > 0;
    }

    detach(){
        this.$dialog.detach();
        this.isShown = false;
        this.$parent = null;
    }
}