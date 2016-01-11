(function (review) {
    'use strict';

    review.clientContext = {
        set: function (key, value) {
            localStorage.setItem(key, JSON.stringify(value));
            return value;
        },
        get: function (key) {
            return JSON.parse(localStorage.getItem(key));
        },
        remove: function (key) {
            localStorage.removeItem(key);
        }
    }

})(window.review = window.review || {});