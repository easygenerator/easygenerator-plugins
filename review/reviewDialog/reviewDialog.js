(function (review) {
    'use strict';

    review.ReviewDialog = function () {
        var constants = review.constants;
        var html = $.parseHTML('{{reviewDialog.html}}');
        var $dialog = $(html);

        function show($spot) {
            debugger;
            $dialog.appendTo($spot);
        }

        return {
            show: show
        };
    };

})(window.review = window.review || {});