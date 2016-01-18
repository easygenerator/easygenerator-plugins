import constants from './../../infrastructure/constants';
import CommentForm from './../commentForm/commentForm';
import htmlMarkupProvider from './../../infrastructure/htmlMarkupProvider';
import controls from './../controls/controls';
import DialogPositioner from './dialogPositioner';
import dialogHtml from './dialog.html';

var $html = $('html');

class Dialog{
    constructor(){
        var that=this;
        this.isShown=false;
        this.dialogPositioner = new DialogPositioner();
        this.$dialog = $(htmlMarkupProvider.getHtmlMarkup(dialogHtml));
        this.commentForm =  new CommentForm(function(){
            that.hide();
        });

        var closeBtn = new controls.Button(this.$dialog, constants.selectors.closeDialogBtn);
        closeBtn.click(function(){
            that.hide();
        });

        this.$dialog.addClass(constants.css.elementReviewDialog).find(constants.selectors.addCommentForm).replaceWith(this.commentForm.$element);
        this.hideOnEscapeProxy = this.hideOnEscape.bind(this);
        this.detachProxy = this.detach.bind(this);
        this.updatePositionProxy = this.updatePosition.bind(this);
    }

    show($parent) {
        var that=this;
        this.$parent = $parent;
        this.$dialog.finish().css({ opacity: 0 }).removeClass(constants.css.shown).show().appendTo(this.$parent);
        this.updatePosition();

        this.commentForm.init();
        this.$dialog.fadeTo(50, 1, function () {
            that.$dialog.addClass(constants.css.shown);
        });

        this.$parent.on(constants.events.elementShown, this.updatePositionProxy);
        this.$parent.on(constants.events.elementDestroyed, this.detachProxy);

        $html.on('keyup',  this.hideOnEscapeProxy);

        this.isShown = true;
    }

    hideOnEscape(evt){
        if (evt.keyCode === 27) {
            this.hide();
        }
    }

    hide() {
        var that=this;
        this.$dialog.finish().fadeOut(50, function () {
            that.$dialog.removeClass(constants.css.shown);
            that.detach();
        });

        this.$parent.off(constants.events.elementShown, this.updatePositionProxy);
        this.$parent.off(constants.events.elementDestroyed, this.detachProxy);

        $html.off('keyup',  this.hideOnEscapeProxy);
    }

    updatePosition() {
        if (this.$parent ) {
            this.dialogPositioner.setPosition(this.$parent, this.$dialog);
        }
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

export default Dialog;