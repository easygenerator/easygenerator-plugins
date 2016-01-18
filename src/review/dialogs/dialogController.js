import constants from './../infrastructure/constants';
import ElementReviewDialog from './elementReview/dialog';
import GeneralReviewDialog from './generalReview/dialog';
import hintController from './../hints/hintController';

class DialogController{
    init(){
        var that = this;
        this.elementReviewDialog = new ElementReviewDialog();
        this.generalReviewDialog = new GeneralReviewDialog(function () {
            if (hintController.isGeneralReviewHintOpened()) {
                hintController.closeGeneralReviewHint();
            }

            if (that.elementReviewDialog.isShown) {
                that.elementReviewDialog.hide();
            }
        });
    }

    showGeneralReviewDialog() {
        this.generalReviewDialog.show();
    }

    showElementReviewDialog($spot) {
        if (this.generalReviewDialog.isExpanded) {
            this.generalReviewDialog.toggleExpansion();
        }

        if (this.elementReviewDialog.isShown) {
            var isShownForElement = this.elementReviewDialog.isShownForElement($spot);
            this.elementReviewDialog.hide();
            if (isShownForElement) {
                return;
            }
        }

        this.elementReviewDialog.show($spot);
    }

    updatePositionIfNeeded() {
        if (this.elementReviewDialog.isShown) {
            this.elementReviewDialog.updatePosition();
        }
    }
}

var dialogController = new DialogController();
export default dialogController;