var constants = {};

constants.patterns = {
    email: /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,15})+)$/
};

constants.clientContextKeys = {
    userName: 'usernameForReview',
    userMail: 'usermailForReview',
    reviewSpotHintShown: 'reviewSpotHintShown',
    reviewGeneralHintShown: 'reviewGeneralHintShown'
};

constants.css = {
    reviewable: 'reviewable',
    reviewSpot: 'review-spot',
    reviewSpotWrapper: 'review-spot-wrapper',

    reviewDialog: 'review-dialog',
    generalReviewDialog: 'general-review-dialog',
    elementReviewDialog: 'element-review-dialog',
    closeDialogBtn: 'close-dialog-btn',
    commentStatusMessage: 'comment-status-message',
    cancelBtn: 'cancel-btn',
    commentBtn: 'comment-btn',
    commentsHeader: 'comments-header',
    message: 'message',
    identifyUserWrapper: 'identify-user-wrapper',
    messageWrapper: 'message-wrapper',
    errorMessage: 'error-message',
    mailInput: 'email-input',
    nameInput: 'name-input',
    addCommentForm: 'add-comment-form',

    reviewHint: 'review-hint',
    reviewHintText: 'review-hint-text',
    reviewHitnBtn: 'review-hint-btn',
    spotReviewHint: 'spot-review-hint',
    generalReviewHint: 'general-review-hint',

    top: 'top',
    left: 'left',
    right: 'right',
    bottom: 'bottom',
    middle: 'middle',
    expanded: 'expanded',
    error: 'error',
    name: 'name',
    email: 'email',
    empty: 'empty',
    shown: 'shown',
    success: 'success',
    fail: 'fail',
    disabled: 'disabled',
    fast: 'fast'
};

constants.selectors = {
    reviewable: '.' + constants.css.reviewable,
    reviewSpot: '.' + constants.css.reviewSpot,
    reviewSpotWrapper: '.' + constants.css.reviewSpotWrapper,

    reviewDialog: '.' + constants.css.reviewDialog,
    closeDialogBtn: '.' + constants.css.closeDialogBtn,
    commentStatusMessage: '.' + constants.css.commentStatusMessage,
    cancelBtn: '.' + constants.css.cancelBtn,
    commentBtn: '.' + constants.css.commentBtn,
    commentsHeader: '.' + constants.css.commentsHeader,
    message: '.' + constants.css.message,
    identifyUserWrapper: '.' + constants.css.identifyUserWrapper,
    messageWrapper: '.' + constants.css.messageWrapper,
    errorMessage: '.' + constants.css.errorMessage,
    mailInput: '.' + constants.css.mailInput,
    nameInput: '.' + constants.css.nameInput,
    addCommentForm: '.' + constants.css.addCommentForm,

    reviewHint: '.' + constants.css.reviewHint,
    reviewHintText: '.' + constants.css.reviewHintText,
    reviewHitnBtn: '.' + constants.css.reviewHitnBtn,

    name: '.' + constants.css.name,
    email: '.' + constants.css.email,
    success: '.' + constants.css.success,
    fail: '.' + constants.css.fail,

    body: 'body',
    iframe: 'iframe',
    img: 'img',
    html: 'html'
};

constants.events = {
    positionUpdated: 'positionUpdated',
    elementHidden: 'elementHidden',
    elementDestroyed: 'elementDestroyed',
    elementShown: 'elementShown',
    keyUp: 'keyup'
};

export default constants;