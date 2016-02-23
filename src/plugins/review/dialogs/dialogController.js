import ElementReviewDialog from './elementReview/dialog';
import GeneralReviewDialog from './generalReview/dialog';
import hintController from './../hints/hintController';

class DialogController{
    init(){
        this.elementReviewDialog = new ElementReviewDialog();
        this.generalReviewDialog = new GeneralReviewDialog(() => {
            if (hintController.isGeneralReviewHintOpened()) {
                hintController.closeGeneralReviewHint();
            }

            if (this.elementReviewDialog.isShown) {
                this.elementReviewDialog.hide();
            }
        });
    }

    showGeneralReviewDialog() {
        this.generalReviewDialog.show();
    }

    showElementReviewDialog(spot) {
        if (this.generalReviewDialog.isExpanded) {
            this.generalReviewDialog.toggleExpansion();
        }

        if (this.elementReviewDialog.isShown) {
            let isShownForElement = this.elementReviewDialog.isShownForElement(spot);
            this.elementReviewDialog.hide();
            if (isShownForElement) {
                return;
            }
        }

        this.elementReviewDialog.show(spot);
    }

    updatePositionIfNeeded() {
        if (this.elementReviewDialog.isShown) {
            this.elementReviewDialog.updatePosition();
        }
    }
}

let dialogController = new DialogController();
export default dialogController;