(function (review) {
    'use strict';

    var constants = {};

    constants.patterns = {
        patternEmail: /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,15})+)$/
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

        reviewHint: 'review-hint',
        reviewHintText: 'review-hint-text',
        reviewHitnBtn: 'review-hint-btn',
        spotReviewHint: 'spot-review-hint',
        generalReviewHint: 'general-review-hint'
    };

    constants.selectors = {
        reviewable: '.' + constants.css.reviewable,
        reviewSpot: '.' + constants.css.reviewSpot,
        reviewSpotWrapper: '.' + constants.css.reviewSpotWrapper,
        reviewDialog: '.' + constants.css.reviewDialog,

        reviewHint: '.' + constants.css.reviewHint,
        reviewHintText: '.' + constants.css.reviewHintText,
        reviewHitnBtn: '.' + constants.css.reviewHitnBtn
    };

    review.constants = constants;

})(window.review = window.review || {});