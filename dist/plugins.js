/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(39);
	__webpack_require__(10);
	__webpack_require__(40);
	__webpack_require__(41);
	__webpack_require__(42);
	__webpack_require__(43);
	__webpack_require__(44);
	__webpack_require__(49);
	module.exports = __webpack_require__(51);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _reviewService = __webpack_require__(2);

	var _reviewService2 = _interopRequireDefault(_reviewService);

	var _hintController = __webpack_require__(3);

	var _hintController2 = _interopRequireDefault(_hintController);

	var _spotController = __webpack_require__(22);

	var _spotController2 = _interopRequireDefault(_spotController);

	var _dialogController = __webpack_require__(27);

	var _dialogController2 = _interopRequireDefault(_dialogController);

	var _eventTracker = __webpack_require__(38);

	var _eventTracker2 = _interopRequireDefault(_eventTracker);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Plugin = function () {
	    function Plugin() {
	        _classCallCheck(this, Plugin);
	    }

	    _createClass(Plugin, [{
	        key: 'init',
	        value: function init(settings) {
	            if ($ === undefined) {
	                throw 'Easygenerator review requires jQuery';
	            }

	            if (!settings) {
	                throw 'Failed to initialize review plugin. Settings are not defined.';
	            }

	            if (!settings.reviewApiUrl) {
	                throw 'Failed to initialize review plugin. Review api url is invalid.';
	            }

	            if (!settings.courseId) {
	                throw 'Failed to initialize review plugin. Course id is invalid.';
	            }

	            _reviewService2.default.init(settings.reviewApiUrl, settings.courseId);
	            _hintController2.default.init();
	            _dialogController2.default.init();

	            var eventTracker = new _eventTracker2.default();

	            eventTracker.trackWindowResize(function () {
	                _spotController2.default.hideSpots();
	            }, function () {
	                _spotController2.default.showSpots();
	            });

	            eventTracker.trackWindowScroll(function () {
	                _spotController2.default.updatePositions();
	            });

	            _dialogController2.default.showGeneralReviewDialog();
	        }
	    }, {
	        key: 'renderSpots',
	        value: function renderSpots() {
	            _spotController2.default.renderSpots();
	        }
	    }]);

	    return Plugin;
	}();

	window.ReviewPlugin = Plugin;

	exports.default = Plugin;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ReviewService = function () {
	    function ReviewService() {
	        _classCallCheck(this, ReviewService);
	    }

	    _createClass(ReviewService, [{
	        key: 'init',
	        value: function init(reviewApiUrl, courseId) {
	            this.reviewApiUrl = reviewApiUrl;
	            this.courseId = courseId;
	        }
	    }, {
	        key: 'postComment',
	        value: function postComment(message, username, useremail) {
	            return $.ajax({
	                url: this.getApiUrl('api/comment/create'),
	                data: { courseId: this.courseId, text: message.trim(), createdByName: username.trim(), createdBy: useremail.trim() },
	                type: 'POST'
	            });
	        }
	    }, {
	        key: 'getApiUrl',
	        value: function getApiUrl(apiPath) {
	            if (this.reviewApiUrl.indexOf('/', this.reviewApiUrl.length - 1) !== -1) {
	                return this.reviewApiUrl + apiPath;
	            }

	            return this.reviewApiUrl + '/' + apiPath;
	        }
	    }]);

	    return ReviewService;
	}();

	var reviewService = new ReviewService();
	exports.default = reviewService;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _hint = __webpack_require__(4);

	var _hint2 = _interopRequireDefault(_hint);

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	var _clientContext = __webpack_require__(21);

	var _clientContext2 = _interopRequireDefault(_clientContext);

	var _localizationService = __webpack_require__(10);

	var _localizationService2 = _interopRequireDefault(_localizationService);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HintController = function () {
	    function HintController() {
	        _classCallCheck(this, HintController);
	    }

	    _createClass(HintController, [{
	        key: 'init',
	        value: function init() {
	            var that = this;
	            this.spotReviewHint = new _hint2.default(_localizationService2.default.localize('elementReviewHint'), _constants2.default.css.spotReviewHint, function () {
	                that.closeSpotReviewHint();
	            }), this.generalReviewHint = new _hint2.default(_localizationService2.default.localize('generalReviewHint'), _constants2.default.css.generalReviewHint + ' ' + _constants2.default.css.top, function () {
	                that.closeGeneralReviewHint();
	            });
	        }
	    }, {
	        key: 'closeSpotReviewHint',
	        value: function closeSpotReviewHint() {
	            this.spotReviewHint.close();
	            _clientContext2.default.set(_constants2.default.clientContextKeys.reviewSpotHintShown, true);

	            this.openHintsIfNeeded();
	        }
	    }, {
	        key: 'closeGeneralReviewHint',
	        value: function closeGeneralReviewHint() {
	            this.generalReviewHint.close();
	            _clientContext2.default.set(_constants2.default.clientContextKeys.reviewGeneralHintShown, true);

	            this.openHintsIfNeeded();
	        }
	    }, {
	        key: 'isSpotReviewHintOpened',
	        value: function isSpotReviewHintOpened() {
	            return this.spotReviewHint.isShown;
	        }
	    }, {
	        key: 'isGeneralReviewHintOpened',
	        value: function isGeneralReviewHintOpened() {
	            return this.generalReviewHint.isShown;
	        }
	    }, {
	        key: 'openHintsIfNeeded',
	        value: function openHintsIfNeeded() {
	            if (this.generalReviewHint.isShown) return;

	            if (this.spotReviewHint.isShown) {
	                spotReviewHint.hide();
	            }

	            if (_clientContext2.default.get(_constants2.default.clientContextKeys.reviewSpotHintShown) !== true) {
	                var $spots = $(_constants2.default.selectors.reviewSpotWrapper);
	                if ($spots.length > 0) {
	                    this.spotReviewHint.open($($spots[0]));
	                    return;
	                }
	            }

	            if (_clientContext2.default.get(_constants2.default.clientContextKeys.reviewGeneralHintShown) !== true) {
	                this.generalReviewHint.open();
	            }
	        }
	    }, {
	        key: 'showHintsIfNeeded',
	        value: function showHintsIfNeeded() {
	            this.spotReviewHint.show();
	            this.generalReviewHint.show();
	        }
	    }, {
	        key: 'hideHints',
	        value: function hideHints() {
	            this.spotReviewHint.hide();
	            this.generalReviewHint.hide();
	        }
	    }]);

	    return HintController;
	}();

	var hintController = new HintController();
	exports.default = hintController;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _hintPositioner = __webpack_require__(5);

	var _hintPositioner2 = _interopRequireDefault(_hintPositioner);

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	var _htmlMarkupProvider = __webpack_require__(9);

	var _htmlMarkupProvider2 = _interopRequireDefault(_htmlMarkupProvider);

	var _hint = __webpack_require__(20);

	var _hint2 = _interopRequireDefault(_hint);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Hint = function () {
	    function Hint(text, css, gotItHandler) {
	        _classCallCheck(this, Hint);

	        this.isShown = false;
	        this.$element = $(_htmlMarkupProvider2.default.getHtmlMarkup(_hint2.default));
	        this.$spot = null;

	        this.$element.addClass(css);
	        this.$element.find(_constants2.default.selectors.reviewHintText).text(text);
	        this.$element.find(_constants2.default.selectors.reviewHitnBtn).click(gotItHandler);

	        this.updatePositionProxy = this.updatePosition.bind(this);
	        this.hideProxy = this.hide.bind(this);
	        this.showProxy = this.show.bind(this);
	        this.closeProxy = this.close.bind(this);
	    }

	    _createClass(Hint, [{
	        key: 'open',
	        value: function open($spot) {
	            this.$element.appendTo($(_constants2.default.selectors.body));
	            if ($spot) {
	                this.$spot = $spot;

	                this.$spot.on(_constants2.default.events.positionUpdated, this.updatePositionProxy);
	                this.$spot.on(_constants2.default.events.elementHidden, this.hideProxy);
	                this.$spot.on(_constants2.default.events.elementShown, this.showProxy);
	                this.$spot.on(_constants2.default.events.elementDestroyed, this.closeProxy);

	                this.updatePosition();
	            }

	            this.isShown = true;
	            this.$element.show();
	        }
	    }, {
	        key: 'show',
	        value: function show() {
	            this.updatePosition();
	            this.$element.show();
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            this.$element.hide();
	        }
	    }, {
	        key: 'close',
	        value: function close() {
	            if (!this.isShown) return;

	            this.$element.detach();
	            this.isShown = false;

	            if (this.$spot) {
	                this.$spot.off(_constants2.default.events.positionUpdated, this.updatePositionProxy);
	                this.$spot.off(_constants2.default.events.elementHidden, this.hideProxy);
	                this.$spot.off(_constants2.default.events.elementShown, this.showProxy);
	                this.$spot.off(_constants2.default.events.elementDestroyed, this.closeProxy);
	                this.$spot = null;
	            }
	        }
	    }, {
	        key: 'updatePosition',
	        value: function updatePosition() {
	            if (this.$spot) {
	                (0, _hintPositioner2.default)().updatePosition(this);
	            }
	        }
	    }]);

	    return Hint;
	}();

	exports.default = Hint;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _elementPositioner = __webpack_require__(6);

	var _elementPositioner2 = _interopRequireDefault(_elementPositioner);

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var HintPositioner = function HintPositioner() {
	    var css = _constants2.default.css,
	        margin = {
	        x: 6,
	        y: 6
	    },
	        positioner = new _elementPositioner2.default(margin);

	    function updatePosition(hint) {
	        var $element = hint.$element,
	            $contextElement = hint.$spot,
	            position = positioner.getPosition($contextElement, $element);

	        positioner.cleanupPosition($element);

	        if (position.horizontal) {
	            setCoordinates($contextElement, $element, position.horizontal);
	            $element.addClass(position.horizontal);
	            return;
	        }

	        if (position.vertical) {
	            setCoordinates($contextElement, $element, position.vertical);
	            $element.addClass(position.vertical);
	            return;
	        }

	        hint.$element.addClass(css.bottom);
	    }

	    function setCoordinates($contextElement, $element, position) {
	        var coordinates = getCoordinates($contextElement, $element, position);
	        var styles = {
	            left: coordinates.x,
	            top: coordinates.y
	        };

	        $element.css(styles);
	    }

	    function getCoordinates($contextElement, $element, position) {
	        var elementSize = {
	            width: $element.outerWidth(),
	            height: $element.outerHeight()
	        };

	        var containerSize = {
	            width: $contextElement.width(),
	            height: $contextElement.height()
	        };

	        var containerPosition = {
	            x: $contextElement.offset().left,
	            y: $contextElement.offset().top
	        };

	        if (position === css.right) {
	            return {
	                x: containerPosition.x + containerSize.width + margin.x,
	                y: containerPosition.y + containerSize.height / 2 - elementSize.height / 2
	            };
	        }

	        if (position === css.left) {
	            return {
	                x: containerPosition.x - margin.x - elementSize.width,
	                y: containerPosition.y + containerSize.height / 2 - elementSize.height / 2
	            };
	        }

	        if (position === css.top) {
	            return {
	                x: containerPosition.x + containerSize.width / 2 - elementSize.width / 2,
	                y: containerPosition.y - margin.y - elementSize.height
	            };
	        }

	        if (position === css.bottom) {
	            return {
	                x: containerPosition.x + containerSize.width / 2 - elementSize.width / 2,
	                y: containerPosition.y + containerSize.height + margin.y
	            };
	        }

	        return undefined;
	    }

	    return {
	        updatePosition: updatePosition
	    };
	};

	exports.default = HintPositioner;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	var _windowPropertiesProvider = __webpack_require__(8);

	var _windowPropertiesProvider2 = _interopRequireDefault(_windowPropertiesProvider);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var css = _constants2.default.css;

	var ElementPositioner = function () {
	    function ElementPositioner(margin) {
	        _classCallCheck(this, ElementPositioner);

	        this.margin = margin;
	        this.$windowContainer = $(_constants2.default.selectors.body);
	    }

	    _createClass(ElementPositioner, [{
	        key: 'cleanupPosition',
	        value: function cleanupPosition($element) {
	            $element.removeClass(css.top);
	            $element.removeClass(css.bottom);
	            $element.removeClass(css.left);
	            $element.removeClass(css.right);
	            $element.removeClass(css.middle);
	        }
	    }, {
	        key: 'getPosition',
	        value: function getPosition($contextElement, $element) {
	            var that = this;

	            var elementSize = {
	                width: $element.outerWidth(),
	                height: $element.outerWidth()
	            };

	            var containerSize = {
	                width: $contextElement.width(),
	                height: $contextElement.height()
	            };

	            return {
	                vertical: getVerticalPosition(),
	                horizontal: getHorizontalPosition()
	            };

	            function getHorizontalPosition() {
	                var preferredPosition = getPreferredHorizontalPosition($contextElement),
	                    fitsRight = fitsToRight($contextElement),
	                    fitsLeft = fitsToLeft($contextElement);

	                if (preferredPosition === css.left && fitsLeft) {
	                    return css.left;
	                }

	                if (preferredPosition === css.right && fitsRight) {
	                    return css.right;
	                }

	                if (fitsLeft) {
	                    return css.left;
	                }

	                if (fitsRight) {
	                    return css.right;
	                }

	                return undefined;

	                function fitsToRight($contextElement) {
	                    var constainerX = $contextElement.offset().left;
	                    return that.$windowContainer.width() - constainerX - containerSize.width - that.margin.x - elementSize.width > 0;
	                }

	                function fitsToLeft($contextElement) {
	                    var constainerX = $contextElement.offset().left;
	                    return constainerX - that.margin.x - elementSize.width > 0;
	                }

	                function getPreferredHorizontalPosition($contextElement) {
	                    var constainerX = $contextElement.offset().left;
	                    return that.$windowContainer.width() / 2 - constainerX > 0 ? css.right : css.left;
	                }
	            }

	            function getVerticalPosition() {
	                var preferredPosition = getPreferredVerticalPosition($contextElement),
	                    fitsTop = fitsToTop($contextElement),
	                    fitsBottom = fitsToBottom($contextElement);

	                if (preferredPosition === css.top && fitsTop) {
	                    return css.top;
	                }

	                if (preferredPosition === css.bottom && fitsBottom) {
	                    return css.bottom;
	                }

	                if (fitsTop) {
	                    return css.top;
	                }

	                if (fitsBottom) {
	                    return css.bottom;
	                }

	                return undefined;

	                function fitsToBottom($contextElement) {
	                    var constainerY = $contextElement.offset().top - _windowPropertiesProvider2.default.scrollTop();
	                    return that.$windowContainer.height() - constainerY - containerSize.height - that.margin.y - elementSize.height > 0;
	                }

	                function fitsToTop($contextElement) {
	                    var constainerY = $contextElement.offset().top - _windowPropertiesProvider2.default.scrollTop();
	                    return constainerY - that.margin.y - elementSize.height > 0;
	                }

	                function getPreferredVerticalPosition($contextElement) {
	                    var constainerY = $contextElement.offset().top - _windowPropertiesProvider2.default.scrollTop();
	                    return that.$windowContainer.height() / 2 - constainerY > 0 ? css.bottom : css.top;
	                }
	            }
	        }
	    }]);

	    return ElementPositioner;
	}();

	exports.default = ElementPositioner;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
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
	    disabled: 'disabled'
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
	    img: 'img'
	};

	constants.events = {
	    positionUpdated: 'positionUpdated',
	    elementHidden: 'elementHidden',
	    elementDestroyed: 'elementDestroyed',
	    elementShown: 'elementShown'
	};

	exports.default = constants;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WindowPropertiesProvider = function () {
	    function WindowPropertiesProvider() {
	        _classCallCheck(this, WindowPropertiesProvider);
	    }

	    _createClass(WindowPropertiesProvider, [{
	        key: "scrollTop",
	        value: function scrollTop() {
	            if (window.pageYOffset != undefined) {
	                return window.pageYOffset;
	            } else {
	                return document.documentElement.scrollTop || document.body.scrollTop || 0;
	            }
	        }
	    }]);

	    return WindowPropertiesProvider;
	}();

	var windowPropertiesProvider = new WindowPropertiesProvider();
	exports.default = windowPropertiesProvider;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _localizationService = __webpack_require__(10);

	var _localizationService2 = _interopRequireDefault(_localizationService);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HtmlMarkupProvider = function () {
	    function HtmlMarkupProvider() {
	        _classCallCheck(this, HtmlMarkupProvider);
	    }

	    _createClass(HtmlMarkupProvider, [{
	        key: 'getHtmlMarkup',
	        value: function getHtmlMarkup(html) {
	            return $.parseHTML(_localizationService2.default.localizeHtml(html));
	        }
	    }]);

	    return HtmlMarkupProvider;
	}();

	var provider = new HtmlMarkupProvider();
	exports.default = provider;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _langs = __webpack_require__(11);

	var _langs2 = _interopRequireDefault(_langs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LocalizationService = function () {
	    function LocalizationService() {
	        _classCallCheck(this, LocalizationService);

	        this.locale = 'en';
	    }

	    _createClass(LocalizationService, [{
	        key: 'init',
	        value: function init(locale) {
	            this.locale = locale;
	            var lang = _langs2.default[this.locale];
	            if (!lang) {
	                this.locale = 'en';
	            }
	        }
	    }, {
	        key: 'localize',
	        value: function localize(key) {
	            return _langs2.default[this.locale][key];
	        }
	    }, {
	        key: 'localizeHtml',
	        value: function localizeHtml(html) {
	            var regExp = /\{\{(.*?)\}\}/gi;
	            var result = '',
	                localizedHtml = html;

	            while (result = regExp.exec(localizedHtml)) {
	                var match = result[0],
	                    key = result[1];

	                localizedHtml = localizedHtml.replace(match, this.localize(key));
	            }

	            if (regExp.exec(localizedHtml)) {
	                localizedHtml = this.localizeHtml(localizedHtml);
	            }

	            return localizedHtml;
	        }
	    }]);

	    return LocalizationService;
	}();

	var localizationService = new LocalizationService();

	window.pluginsLocalizationService = localizationService;

	exports.default = localizationService;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _cn = __webpack_require__(12);

	var _cn2 = _interopRequireDefault(_cn);

	var _de = __webpack_require__(13);

	var _de2 = _interopRequireDefault(_de);

	var _en = __webpack_require__(14);

	var _en2 = _interopRequireDefault(_en);

	var _es = __webpack_require__(15);

	var _es2 = _interopRequireDefault(_es);

	var _fr = __webpack_require__(16);

	var _fr2 = _interopRequireDefault(_fr);

	var _nl = __webpack_require__(17);

	var _nl2 = _interopRequireDefault(_nl);

	var _ptBr = __webpack_require__(18);

	var _ptBr2 = _interopRequireDefault(_ptBr);

	var _ua = __webpack_require__(19);

	var _ua2 = _interopRequireDefault(_ua);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var langs = {
		'cn': _cn2.default,
		'de': _de2.default,
		'en': _en2.default,
		'es': _es2.default,
		'fr': _fr2.default,
		'nl': _nl2.default,
		'pt-br': _ptBr2.default,
		'ua': _ua2.default
	};

	exports.default = langs;

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = {
		"commentWasNotSent": "评论没有发送",
		"commentWasSent": "评论已发送",
		"leaveYourComment": "发表评论",
		"send": "发布评论",
		"tryAgain": "重试",
		"yourMessage": "输入您的消息...",
		"identifyMessage": "请填写您自己的相关信息",
		"name": "姓名",
		"email": "电子邮件",
		"enterValidEmailError": "输入有效电子邮件",
		"enterYourNameError": "输入您的姓名",
		"gotIt": "我明白了",
		"elementReviewHint": "点击元素附近的图标发表评论。",
		"generalReviewHint": "点击面板此处发表一般评论。",
		"leaveGeneralComment": "发表一般评论",
		"typeYourCommentHere": "请在此处输入您的评论...",
		"cancel": "取消",
		"postComment": "发布评论"
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = {
		"commentWasNotSent": "Der Kommentar wurde nicht gesendet.",
		"commentWasSent": "Der Kommentar wurde gesendet.",
		"leaveYourComment": "Kommentieren Sie diesen Beitrag",
		"send": "Kommentar posten",
		"tryAgain": "Versuchen Sie es erneut.",
		"yourMessage": "Ihre Nachricht tippen ...",
		"identifyMessage": "Bitte identifizieren Sie sich",
		"name": "Name",
		"email": "E-Mail",
		"enterValidEmailError": "Geben Sie eine gültige E-Mail ein",
		"enterYourNameError": "Geben Sie Ihren Namen ein",
		"gotIt": "Alles klar",
		"elementReviewHint": "Klicken Sie auf das Symbol in der Nähe der Elemente, um den Kommentar zu hinterlassen.",
		"generalReviewHint": "Klicken Sie auf den Bereich hier, um einen allgemeinen Kommentar zu hinterlassen.",
		"leaveGeneralComment": "Allgemeinen Kommentar hinterlassen",
		"typeYourCommentHere": "Schreiben Sie Ihren Kommentar hier...",
		"cancel": "Abbrechen",
		"postComment": "Kommentar posten"
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = {
		"commentWasNotSent": "Comment was not sent.",
		"commentWasSent": "Comment was sent",
		"leaveYourComment": "Leave your comment",
		"send": "Post comment",
		"tryAgain": "Try again",
		"yourMessage": "Type your message...",
		"identifyMessage": "Please identify yourself",
		"name": "Name",
		"email": "E-mail",
		"enterValidEmailError": "Enter a valid e-mail",
		"enterYourNameError": "Enter a valid name",
		"gotIt": "Got it",
		"elementReviewHint": "Click on icon near elements to leave a comment.",
		"generalReviewHint": "Click on the panel here to leave a general comment.",
		"leaveGeneralComment": "Leave general comments",
		"typeYourCommentHere": "Type your comment here...",
		"cancel": "Cancel",
		"postComment": "Post comment"
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = {
		"commentWasNotSent": "El comentario no fue enviado.",
		"commentWasSent": "El comentario fue enviado",
		"leaveYourComment": "Deje su comentario",
		"send": "Publicar comentario",
		"tryAgain": "Intentar de nuevo",
		"yourMessage": "Escriba el mensaje...",
		"identifyMessage": "Identifíquese",
		"name": "Nombre",
		"email": "Dirección de correo electrónico",
		"enterValidEmailError": "Introduzca una dirección de correo electrónico válida",
		"enterYourNameError": "Introduzca un nombre válido",
		"gotIt": "Lo tengo",
		"elementReviewHint": "Haga clic en el icono situado junto a los elementos para dejar su comentario.",
		"generalReviewHint": "Haga clic en este panel para dejar el comentario general.",
		"leaveGeneralComment": "Dejar comentario general",
		"typeYourCommentHere": "Escriba su comentario aquí...",
		"cancel": "Cancelar",
		"postComment": "Publicar comentario"
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = {
		"commentWasNotSent": "Le commentaire n'a pas été envoyé.",
		"commentWasSent": "Le commentaire a été envoyé",
		"leaveYourComment": "Laissez votre commentaire",
		"send": "Publiez le commentaire",
		"tryAgain": "Réessayer",
		"yourMessage": "Saisissez votre message...",
		"identifyMessage": "Veuillez vous identifier",
		"name": "Nom",
		"email": "Adresse email",
		"enterValidEmailError": "Veuillez saisir une adresse email valide",
		"enterYourNameError": "Veuillez saisir votre nom",
		"gotIt": "Récupéré",
		"elementReviewHint": "Pour laisser un commentaire, cliquez sur l'icône en regard de l'élément concerné.",
		"generalReviewHint": "Cliquez ici sur le panneau pour laisser le commentaire général.",
		"leaveGeneralComment": "Laisser un commentaire général",
		"typeYourCommentHere": "Saisissez votre commentaire ici...",
		"cancel": "Annuler",
		"postComment": "Publier un commentaire"
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = {
		"commentWasNotSent": "Opmerking niet verzonden",
		"commentWasSent": "Opmerking verzonden",
		"leaveYourComment": "Geef uw mening",
		"send": "Plaats opmerking",
		"tryAgain": "Probeer opnieuw",
		"yourMessage": "Typ uw bericht",
		"identifyMessage": "Vul uw gegevens in",
		"name": "Naam",
		"email": "Email",
		"enterValidEmailError": "Vul een correct emailadres in",
		"enterYourNameError": "Vul een geldige naam in",
		"gotIt": "Ik snap het",
		"elementReviewHint": "Klik op het pictogram om een opmerking te plaatsen",
		"generalReviewHint": "Klik op het panel om een opmerking te plaatsen",
		"leaveGeneralComment": "Plaats een algemene opmerking",
		"typeYourCommentHere": "Typ je opmerking hier",
		"cancel": "Annuleer",
		"postComment": "Plaats opmerking"
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = {
		"commentWasNotSent": "Comentário não foi enviado.",
		"commentWasSent": "Comentário foi enviado",
		"leaveYourComment": "Deixe seu comentário",
		"send": "Postar comentário",
		"tryAgain": "Tente novamente",
		"yourMessage": "Digite sua mensagem...",
		"identifyMessage": "Identifique-se",
		"name": "Nome",
		"email": "Email",
		"enterValidEmailError": "Insira um email válido",
		"enterYourNameError": "Insira seu nome",
		"gotIt": "Entendi",
		"elementReviewHint": "Clique no ícone próximo aos elementos para deixar um comentário.",
		"generalReviewHint": "Clique no painel para deixar um comentário geral.",
		"leaveGeneralComment": "Deixe comentário geral",
		"typeYourCommentHere": "Digite o seu comentário aqui...",
		"cancel": "Cancele",
		"postComment": "Publique o comentário"
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = {
		"commentWasNotSent": "Коментар не був відправлений.",
		"commentWasSent": "Відправлено",
		"leaveYourComment": "Залиште свій коментар",
		"send": "Відправити коментар",
		"tryAgain": "Спробувати знову",
		"yourMessage": "Напишіть Ваше повідомлення...",
		"identifyMessage": "Будь-ласка, ідентифікуйте себе",
		"name": "Ім'я",
		"email": "E-mail",
		"enterValidEmailError": "Введіть валідний e-mail",
		"enterYourNameError": "Введіть своє ім'я",
		"gotIt": "Зрозуміло",
		"elementReviewHint": "Натисніть на іконку щоб залишити коментар",
		"generalReviewHint": "Натисніть на панель щоб залишити загальний коментар",
		"leaveGeneralComment": "Залиште загальний коментар",
		"typeYourCommentHere": "Ваш коментар...",
		"cancel": "Відміна",
		"postComment": "Відіслати коментар"
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = "<div class=\"review-hint\">\r\n    <div class=\"review-hint-text-wrapper\">\r\n        <div class=\"review-hint-text\"></div>\r\n    </div>\r\n    <div class=\"review-hint-action-wrapper\">\r\n        <button class=\"review-hint-btn btn\">{{gotIt}}</button>\r\n    </div>\r\n</div>\r\n";

/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ClientContext = function () {
	    function ClientContext() {
	        _classCallCheck(this, ClientContext);
	    }

	    _createClass(ClientContext, [{
	        key: "set",
	        value: function set(key, value) {
	            localStorage.setItem(key, JSON.stringify(value));
	            return value;
	        }
	    }, {
	        key: "get",
	        value: function get(key) {
	            return JSON.parse(localStorage.getItem(key));
	        }
	    }, {
	        key: "remove",
	        value: function remove(key) {
	            localStorage.removeItem(key);
	        }
	    }]);

	    return ClientContext;
	}();

	var clientContext = new ClientContext();
	module.exports = clientContext;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	var _SpotCollection = __webpack_require__(23);

	var _SpotCollection2 = _interopRequireDefault(_SpotCollection);

	var _Spot = __webpack_require__(24);

	var _Spot2 = _interopRequireDefault(_Spot);

	var _multiEventTracker = __webpack_require__(37);

	var _multiEventTracker2 = _interopRequireDefault(_multiEventTracker);

	var _hintController = __webpack_require__(3);

	var _hintController2 = _interopRequireDefault(_hintController);

	var _dialogController = __webpack_require__(27);

	var _dialogController2 = _interopRequireDefault(_dialogController);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SpotController = function () {
	    function SpotController() {
	        _classCallCheck(this, SpotController);

	        this.spotCollection = new _SpotCollection2.default();
	    }

	    _createClass(SpotController, [{
	        key: 'hideSpots',
	        value: function hideSpots() {
	            this.spotCollection.hideSpots();
	            _hintController2.default.hideHints();
	        }
	    }, {
	        key: 'showSpots',
	        value: function showSpots() {
	            this.spotCollection.showSpots();
	            _hintController2.default.showHintsIfNeeded();
	        }
	    }, {
	        key: 'updatePositions',
	        value: function updatePositions() {
	            this.spotCollection.updatePositions();
	            _dialogController2.default.updatePositionIfNeeded();
	        }
	    }, {
	        key: 'renderSpots',
	        value: function renderSpots() {
	            var spotIds = [];
	            var that = this;
	            $(_constants2.default.selectors.reviewable).each(function () {
	                var $element = $(this);
	                var spot = that.renderSpot($element);
	                if (spot) {
	                    spotIds.push(spot.id);
	                }
	            });

	            this.spotCollection.filterSpots(spotIds);
	            _hintController2.default.openHintsIfNeeded();
	        }
	    }, {
	        key: 'renderSpot',
	        value: function renderSpot($element) {
	            var spotId = getReviewSpotIdAttachedToElement($element);
	            if (spotId) {
	                var spot = this.spotCollection.getSpotById(spotId);
	                spot.updatePosition();
	                return spot;
	            }

	            var spot = this.spotCollection.addSpot($element);
	            spot.show();
	            return spot;

	            function getReviewSpotIdAttachedToElement($element) {
	                var data = $element.data();
	                if (!data) return false;

	                return data.reviewSpotId;
	            }
	        }
	    }]);

	    return SpotController;
	}();

	var spotController = new SpotController();
	exports.default = spotController;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _Spot = __webpack_require__(24);

	var _Spot2 = _interopRequireDefault(_Spot);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SpotCollection = function () {
	    function SpotCollection() {
	        _classCallCheck(this, SpotCollection);

	        this.collection = [];
	        this.maxId = 0;
	    }

	    _createClass(SpotCollection, [{
	        key: 'addSpot',
	        value: function addSpot($contextElement) {
	            var that = this;
	            var spot = new _Spot2.default(this.maxId + 1, $contextElement);
	            spot.render();
	            this.collection.push(spot);
	            this.maxId++;

	            new ResizeSensor(spot.$contextElement, function () {
	                that.updatePositions();
	            });

	            return spot;
	        }
	    }, {
	        key: 'getSpotById',
	        value: function getSpotById(id) {
	            var result = null;
	            this.collection.forEach(function (spot) {
	                if (spot.id === id) {
	                    result = spot;
	                }
	            });

	            return result;
	        }
	    }, {
	        key: 'hideSpots',
	        value: function hideSpots() {
	            this.collection.forEach(function (spot) {
	                spot.hide();
	            });
	        }
	    }, {
	        key: 'showSpots',
	        value: function showSpots() {
	            this.collection.forEach(function (spot) {
	                spot.show();
	            });
	        }
	    }, {
	        key: 'updatePositions',
	        value: function updatePositions(animate) {
	            this.collection.forEach(function (spot) {
	                spot.updatePosition(animate);
	            });
	        }
	    }, {
	        key: 'detachSpot',
	        value: function detachSpot(spot) {
	            ResizeSensor.detach(spot.$contextElement);
	            spot.remove();
	        }
	    }, {
	        key: 'filterSpots',
	        value: function filterSpots(ids) {
	            var that = this;
	            var arr = this.collection.filter(function (item) {
	                return ids.some(function (id) {
	                    return item.id === id;
	                });
	            });

	            this.collection.forEach(function (spot) {
	                if (arr.indexOf(spot) === -1) {
	                    that.detachSpot(spot);
	                }
	            });

	            this.collection = arr;
	        }
	    }]);

	    return SpotCollection;
	}();

	exports.default = SpotCollection;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _spotPositioner = __webpack_require__(25);

	var _spotPositioner2 = _interopRequireDefault(_spotPositioner);

	var _spot = __webpack_require__(26);

	var _spot2 = _interopRequireDefault(_spot);

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	var _htmlMarkupProvider = __webpack_require__(9);

	var _htmlMarkupProvider2 = _interopRequireDefault(_htmlMarkupProvider);

	var _dialogController = __webpack_require__(27);

	var _dialogController2 = _interopRequireDefault(_dialogController);

	var _hintController = __webpack_require__(3);

	var _hintController2 = _interopRequireDefault(_hintController);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Spot = function () {
	    function Spot(id, $contextElement) {
	        _classCallCheck(this, Spot);

	        this.id = id;
	        this.$element = null;
	        this.$contextElement = $contextElement;
	        this.spotMarkup = _htmlMarkupProvider2.default.getHtmlMarkup(_spot2.default);
	    }

	    _createClass(Spot, [{
	        key: 'render',
	        value: function render() {
	            var $element = $(this.spotMarkup).appendTo(_constants2.default.selectors.body);
	            this.$element = $element;
	            $element.hide();

	            this.$element.data({ reviewSpotId: this.id });
	            this.$contextElement.data({ reviewSpotId: this.id });

	            this.$element.find(_constants2.default.selectors.reviewSpot).click(function () {
	                if (_hintController2.default.isSpotReviewHintOpened()) {
	                    _hintController2.default.closeSpotReviewHint();
	                }

	                _dialogController2.default.showElementReviewDialog($element);
	            });
	        }
	    }, {
	        key: 'show',
	        value: function show() {
	            this.updatePosition();
	            this.$element.trigger(_constants2.default.events.elementShown);
	            this.$element.show();
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            this.$element.trigger(_constants2.default.events.elementHidden);
	            this.$element.hide();
	        }
	    }, {
	        key: 'updatePosition',
	        value: function updatePosition() {
	            new _spotPositioner2.default().updatePosition(this);
	        }
	    }, {
	        key: 'remove',
	        value: function remove() {
	            this.$element.trigger(_constants2.default.events.elementDestroyed);
	            this.$element.remove();
	        }
	    }]);

	    return Spot;
	}();

	exports.default = Spot;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	var _windowPropertiesProvider = __webpack_require__(8);

	var _windowPropertiesProvider2 = _interopRequireDefault(_windowPropertiesProvider);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var margin = {
	    x: 3,
	    y: 10
	},
	    size = {
	    width: 32,
	    height: 32
	};

	var SpotPositioner = function () {
	    function SpotPositioner() {
	        _classCallCheck(this, SpotPositioner);

	        this.$windowContainer = $(window);
	    }

	    _createClass(SpotPositioner, [{
	        key: 'updatePosition',
	        value: function updatePosition(spot) {
	            var currentPosition = spot.$element.position();
	            var position = this.calculatePosition(spot);

	            if (currentPosition.left === position.x && currentPosition.top === position.y) return;

	            var styles = {
	                left: position.x,
	                top: position.y
	            };

	            spot.$element.css(styles);
	            spot.$element.trigger(_constants2.default.events.positionUpdated);
	        }
	    }, {
	        key: 'calculatePosition',
	        value: function calculatePosition(spot) {
	            var that = this;

	            var position = getContextElementTopRightPosition(spot.$contextElement);

	            position.x = fitsInOuterCornerHirizonatlly(position) ? position.x + margin.x : position.x - size.width;

	            if (isElementPartlyScrolledUp(spot.$contextElement)) {
	                position.y = _windowPropertiesProvider2.default.scrollTop() + margin.y;
	            } else {
	                position.y = fitsInOuterCornerVertically(position) ? position.y + margin.y - size.width : position.y + margin.y;
	            }

	            return position;

	            function isElementPartlyScrolledUp($contextElement) {
	                var scrollTop = _windowPropertiesProvider2.default.scrollTop();
	                if (scrollTop === 0) return false;

	                var y = $contextElement.offset().top - scrollTop;
	                var height = $contextElement.outerHeight();

	                return y - size.height + margin.y < 0 && y + height >= size.height + margin.y;
	            }

	            function getContextElementTopRightPosition($contextElement) {
	                var offset = $contextElement.offset();
	                return {
	                    y: offset.top,
	                    x: offset.left + $contextElement.outerWidth()
	                };
	            }

	            function fitsInOuterCornerHirizonatlly(position) {
	                var windowWidth = that.$windowContainer.width();
	                return windowWidth - position.x - size.width - margin.x > 0;
	            }

	            function fitsInOuterCornerVertically(position) {
	                return position.y + margin.y - size.width > 0;
	            }
	        }
	    }]);

	    return SpotPositioner;
	}();

	exports.default = SpotPositioner;

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = "<div class=\"review-spot-wrapper\">\r\n    <div class=\"review-spot\"></div>\r\n</div>";

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	var _dialog = __webpack_require__(28);

	var _dialog2 = _interopRequireDefault(_dialog);

	var _dialog3 = __webpack_require__(35);

	var _dialog4 = _interopRequireDefault(_dialog3);

	var _hintController = __webpack_require__(3);

	var _hintController2 = _interopRequireDefault(_hintController);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DialogController = function () {
	    function DialogController() {
	        _classCallCheck(this, DialogController);
	    }

	    _createClass(DialogController, [{
	        key: 'init',
	        value: function init() {
	            var that = this;
	            this.elementReviewDialog = new _dialog2.default();
	            this.generalReviewDialog = new _dialog4.default(function () {
	                if (_hintController2.default.isGeneralReviewHintOpened()) {
	                    _hintController2.default.closeGeneralReviewHint();
	                }

	                if (that.elementReviewDialog.isShown) {
	                    that.elementReviewDialog.hide();
	                }
	            });
	        }
	    }, {
	        key: 'showGeneralReviewDialog',
	        value: function showGeneralReviewDialog() {
	            this.generalReviewDialog.show();
	        }
	    }, {
	        key: 'showElementReviewDialog',
	        value: function showElementReviewDialog($spot) {
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
	    }, {
	        key: 'updatePositionIfNeeded',
	        value: function updatePositionIfNeeded() {
	            if (this.elementReviewDialog.isShown) {
	                this.elementReviewDialog.updatePosition();
	            }
	        }
	    }]);

	    return DialogController;
	}();

	var dialogController = new DialogController();
	exports.default = dialogController;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	var _commentForm = __webpack_require__(29);

	var _commentForm2 = _interopRequireDefault(_commentForm);

	var _htmlMarkupProvider = __webpack_require__(9);

	var _htmlMarkupProvider2 = _interopRequireDefault(_htmlMarkupProvider);

	var _controls = __webpack_require__(31);

	var _controls2 = _interopRequireDefault(_controls);

	var _dialogPositioner = __webpack_require__(33);

	var _dialogPositioner2 = _interopRequireDefault(_dialogPositioner);

	var _dialog = __webpack_require__(34);

	var _dialog2 = _interopRequireDefault(_dialog);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Dialog = function () {
	    function Dialog() {
	        _classCallCheck(this, Dialog);

	        var that = this;
	        this.isShown = false;
	        this.$html = $('html');
	        this.dialogPositioner = new _dialogPositioner2.default();
	        this.$dialog = $(_htmlMarkupProvider2.default.getHtmlMarkup(_dialog2.default));
	        this.commentForm = new _commentForm2.default(function () {
	            that.hide();
	        });

	        var closeBtn = _controls2.default.Button(this.$dialog, _constants2.default.selectors.closeDialogBtn);
	        closeBtn.click(function () {
	            that.hide();
	        });

	        this.$dialog.addClass(_constants2.default.css.elementReviewDialog).find(_constants2.default.selectors.addCommentForm).replaceWith(this.commentForm.$element);
	        this.hideOnEscapeProxy = this.hideOnEscape.bind(this);
	        this.detachProxy = this.detach.bind(this);
	        this.updatePositionProxy = this.updatePosition.bind(this);
	    }

	    _createClass(Dialog, [{
	        key: 'show',
	        value: function show($parent) {
	            var that = this;
	            this.$parent = $parent;
	            this.$dialog.finish().css({ opacity: 0 }).removeClass(_constants2.default.css.shown).show().appendTo($parent);
	            this.updatePosition();

	            this.commentForm.init();
	            this.$dialog.fadeTo(50, 1, function () {
	                that.$dialog.addClass(_constants2.default.css.shown);
	            });

	            $parent.on(_constants2.default.events.elementShown, this.updatePositionProxy);
	            $parent.on(_constants2.default.events.elementDestroyed, this.detachProxy);

	            this.$html.on('keyup', this.hideOnEscapeProxy);

	            this.isShown = true;
	        }
	    }, {
	        key: 'hideOnEscape',
	        value: function hideOnEscape(evt) {
	            if (evt.keyCode === 27) {
	                this.hide();
	            }
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            var that = this;
	            this.$dialog.finish().fadeOut(50, function () {
	                that.$dialog.removeClass(_constants2.default.css.shown);
	                that.detach();
	            });

	            if (this.$parent) {
	                this.$parent.off(_constants2.default.events.elementShown, this.updatePositionProxy);
	                this.$parent.off(_constants2.default.events.elementDestroyed, this.detachProxy);
	            }

	            this.$html.off('keyup', this.hideOnEscapeProxy);
	        }
	    }, {
	        key: 'updatePosition',
	        value: function updatePosition() {
	            if (this.$parent) {
	                this.dialogPositioner.setPosition(this.$parent, this.$dialog);
	            }
	        }
	    }, {
	        key: 'isShownForElement',
	        value: function isShownForElement($spot) {
	            return $spot.find(_constants2.default.selectors.reviewDialog).length > 0;
	        }
	    }, {
	        key: 'detach',
	        value: function detach() {
	            this.$dialog.detach();
	            this.isShown = false;
	            this.$parent = null;
	        }
	    }]);

	    return Dialog;
	}();

	exports.default = Dialog;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	var _clientContext = __webpack_require__(21);

	var _clientContext2 = _interopRequireDefault(_clientContext);

	var _htmlMarkupProvider = __webpack_require__(9);

	var _htmlMarkupProvider2 = _interopRequireDefault(_htmlMarkupProvider);

	var _CommentFormControls = __webpack_require__(30);

	var _CommentFormControls2 = _interopRequireDefault(_CommentFormControls);

	var _commentForm = __webpack_require__(32);

	var _commentForm2 = _interopRequireDefault(_commentForm);

	var _reviewService = __webpack_require__(2);

	var _reviewService2 = _interopRequireDefault(_reviewService);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CommentForm = function () {
	    function CommentForm(closeHandler) {
	        _classCallCheck(this, CommentForm);

	        var that = this;
	        this.$element = $(_htmlMarkupProvider2.default.getHtmlMarkup(_commentForm2.default));
	        this.controls = new _CommentFormControls2.default(this.$element);

	        this.controls.cancelBtn.click(function () {
	            if (closeHandler) {
	                closeHandler();
	            }
	        });
	        this.controls.submitBtn.click(function () {
	            that.submit();
	        });
	        this.controls.messageForm.messageField.onfocus(function () {
	            that.controls.commentStatusMessage.fadeOut();
	        });
	    }

	    _createClass(CommentForm, [{
	        key: 'submit',
	        value: function submit() {
	            if (!this.controls.identifyForm.isShown) {
	                if (this.controls.messageForm.messageField.getValue().trim().length === 0) {
	                    this.controls.messageForm.messageField.setErrorMark();
	                    return;
	                }
	            } else {
	                if (!this.validateIdentifyUserForm()) return;

	                _clientContext2.default.set(_constants2.default.clientContextKeys.userName, this.controls.identifyForm.nameField.getValue().trim());
	                _clientContext2.default.set(_constants2.default.clientContextKeys.userMail, this.controls.identifyForm.mailField.getValue().trim());
	            }

	            var username = _clientContext2.default.get(_constants2.default.clientContextKeys.userName),
	                usermail = _clientContext2.default.get(_constants2.default.clientContextKeys.userMail);

	            if (!username || !username.trim() || !usermail || !usermail.trim()) {
	                this.switchToIdentifyUserForm();
	                return;
	            }

	            var message = this.controls.messageForm.messageField.getValue().trim();
	            this.controls.submitBtn.disable();
	            var that = this;
	            _reviewService2.default.postComment(message, username, usermail).done(function (response) {
	                that.switchToMessageForm();
	                that.controls.submitBtn.enable();
	                if (response) {
	                    if (response.success) {
	                        that.clear();
	                        that.controls.commentStatusMessage.success.fadeIn();
	                    } else {
	                        that.controls.commentStatusMessage.fail.fadeIn();
	                    }
	                }
	            }).fail(function () {
	                that.controls.submitBtn.enable();
	                that.switchToMessageForm();
	                that.controls.commentStatusMessage.fail.fadeIn();
	            });
	        }
	    }, {
	        key: 'init',
	        value: function init() {
	            this.clear();
	            this.controls.messageForm.messageField.focus();
	        }
	    }, {
	        key: 'clear',
	        value: function clear() {
	            this.controls.commentStatusMessage.hide();
	            this.switchToMessageForm();

	            this.controls.messageForm.messageField.clear();
	        }
	    }, {
	        key: 'switchToIdentifyUserForm',
	        value: function switchToIdentifyUserForm() {
	            this.controls.identifyForm.nameField.clear();
	            this.controls.identifyForm.mailField.clear();

	            this.controls.messageForm.hide();
	            this.controls.identifyForm.fadeIn();
	        }
	    }, {
	        key: 'switchToMessageForm',
	        value: function switchToMessageForm() {
	            this.controls.identifyForm.hide();
	            this.controls.messageForm.fadeIn();
	        }
	    }, {
	        key: 'validateIdentifyUserForm',
	        value: function validateIdentifyUserForm() {
	            var isValid = true;
	            if (!this.isIdentifyFormNameValid()) {
	                this.controls.identifyForm.nameField.setErrorMark();
	                isValid = false;
	            }

	            if (!this.isIdentifyFormMailValid()) {
	                this.controls.identifyForm.mailField.setErrorMark();
	                isValid = false;
	            }

	            return isValid;
	        }
	    }, {
	        key: 'isIdentifyFormNameValid',
	        value: function isIdentifyFormNameValid() {
	            var value = this.controls.identifyForm.nameField.getValue();
	            return value && value.trim() && value.trim().length <= 254;
	        }
	    }, {
	        key: 'isIdentifyFormMailValid',
	        value: function isIdentifyFormMailValid() {
	            var value = this.controls.identifyForm.mailField.getValue();
	            return value && value.trim() && value.trim().length <= 254 && _constants2.default.patterns.email.test(value.trim());
	        }
	    }]);

	    return CommentForm;
	}();

	exports.default = CommentForm;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	var _controls = __webpack_require__(31);

	var _controls2 = _interopRequireDefault(_controls);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var CommentFormControls = function CommentFormControls($dialog) {
	    var formControls = {
	        cancelBtn: Button(_constants2.default.selectors.cancelBtn),
	        submitBtn: Button(_constants2.default.selectors.commentBtn),

	        commentStatusMessage: CommentStatusMessage(),

	        messageForm: MessageForm(),
	        identifyForm: IdentifyForm()
	    };

	    return formControls;

	    function CommentStatusMessage() {
	        var control = Control.call(this, _constants2.default.selectors.commentStatusMessage);

	        control.success = Message(_constants2.default.selectors.commentStatusMessage + _constants2.default.selectors.success);
	        control.fail = Message(_constants2.default.selectors.commentStatusMessage + _constants2.default.selectors.fail);

	        return control;
	    }

	    function MessageForm() {
	        var control = Control.call(this, _constants2.default.selectors.messageWrapper);

	        control.messageField = TextField(_constants2.default.selectors.message);

	        return control;
	    }

	    function IdentifyForm() {
	        var control = Control.call(this, _constants2.default.selectors.identifyUserWrapper);

	        control.nameField = TextField(_constants2.default.selectors.nameInput);
	        control.mailField = TextField(_constants2.default.selectors.mailInput);
	        control.nameErrorMessage = Message(_constants2.default.selectors.errorMessage + _constants2.default.selectors.name);
	        control.mailErrorMassage = Message(_constants2.default.selectors.errorMessage + _constants2.default.selectors.email);

	        return control;
	    }

	    function Message(selector) {
	        return _controls2.default.Message($dialog, selector);
	    }

	    function Button(selector) {
	        return _controls2.default.Button($dialog, selector);
	    }

	    function TextField(selector) {
	        return _controls2.default.TextField($dialog, selector);
	    }

	    function Control(selector) {
	        return _controls2.default.Control($dialog, selector);
	    }
	};

	exports.default = CommentFormControls;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var controls = {
	    Message: Message,
	    Button: Button,
	    TextField: TextField,
	    Control: Control
	};

	function Message($parent, selector) {
	    return controls.Control.call(this, $parent, selector);
	}

	function Button($parent, selector) {
	    var control = controls.Control.call(this, $parent, selector),
	        $control = control.$control;

	    control.click = function (handler) {
	        $control.click(function (e) {
	            e.preventDefault();
	            e.stopPropagation();
	            handler();
	            return false;
	        });
	    };

	    return control;
	}

	function TextField($parent, selector) {
	    var control = controls.Control.call(this, $parent, selector),
	        $control = control.$control,
	        $errorMessage = $control.nextAll(_constants2.default.selectors.errorMessage),
	        onfocus = null;

	    $control.change(onChange);
	    $control.focus(function () {
	        control.removeErrorMark();
	        if (onfocus) {
	            onfocus();
	        }
	    });

	    control.onfocus = function (handler) {
	        onfocus = handler;
	    };

	    control.getValue = function () {
	        return $control.val();
	    };

	    control.setValue = function (value) {
	        $control.val(value);
	        onChange();
	    };

	    control.clear = function () {
	        control.setValue('');
	        control.removeErrorMark();
	    };

	    control.setErrorMark = function () {
	        control.addClass(_constants2.default.css.error);
	        $errorMessage.addClass(_constants2.default.css.shown);
	    };

	    control.removeErrorMark = function () {
	        control.removeClass(_constants2.default.css.error);
	        $errorMessage.removeClass(_constants2.default.css.shown);
	    };

	    function onChange() {
	        control.removeErrorMark();
	        if (control.getValue().length === 0) {
	            control.addClass(_constants2.default.css.empty);
	        } else {
	            control.removeClass(_constants2.default.css.empty);
	        }
	    }

	    return control;
	}

	function Control($parent, selector) {
	    var $control = $parent.find(selector);

	    var control = {
	        isShown: true,
	        show: show,
	        hide: hide,
	        focus: focus,
	        addClass: addClass,
	        removeClass: removeClass,
	        fadeIn: fadeIn,
	        fadeOut: fadeOut,
	        disable: disable,
	        enable: enable,
	        $control: $control
	    };

	    return control;

	    function addClass(css) {
	        $control.addClass(css);
	    }

	    function removeClass(css) {
	        $control.removeClass(css);
	    }

	    function show() {
	        $control.show();
	        control.isShown = true;
	    }

	    function hide() {
	        $control.hide();
	        control.isShown = false;
	    }

	    function fadeOut() {
	        $control.fadeOut('fast');
	        control.isShown = false;
	    }

	    function fadeIn() {
	        $control.fadeIn('fast');
	        control.isShown = true;
	    }

	    function focus() {
	        $control.focus();
	    }

	    function disable() {
	        $control.prop('disabled', true);
	        addClass('disabled');
	    }

	    function enable() {
	        $control.prop('disabled', false);
	        removeClass('disabled');
	    }
	}

	exports.default = controls;

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = "<form class=\"add-comment-form\">\r\n    <div class=\"message-wrapper\">\r\n        <div class=\"add-comment-form-title\">{{leaveYourComment}}</div>\r\n        <textarea class=\"comment-text-block message\" placeholder=\"{{typeYourCommentHere}}\"></textarea>\r\n    </div>\r\n    <div class=\"identify-user-wrapper\">\r\n        <div class=\"identify-user-title\">{{identifyMessage}}</div>\r\n        <div class=\"identify-user-row\">\r\n            <input class=\"name-input\" type=\"text\" />\r\n            <label>{{name}}</label>\r\n            <span class=\"error-message name\">{{enterYourNameError}}</span>\r\n        </div>\r\n        <div class=\"identify-user-row\">\r\n            <input class=\"email-input\" type=\"email\" />\r\n            <label>{{email}}</label>\r\n            <span class=\"error-message email\">{{enterValidEmailError}}</span>\r\n        </div>\r\n    </div>\r\n    <div class=\"comment-action-wrapper\">\r\n        <div class=\"comment-status-message success\" title=\"{{commentWasSent}}\">{{commentWasSent}}</div>\r\n        <div class=\"comment-status-message fail\" title=\"{{commentWasNotSent}}\">{{commentWasNotSent}}<br />{{tryAgain}}</div>\r\n        <div class=\"comment-actions\">\r\n            <button title=\"{{cancel}}\" class=\"cancel-btn\" type=\"reset\">{{cancel}}</button>\r\n            <button title=\"{{postComment}}\" class=\"comment-btn\" type=\"submit\">{{postComment}}</button>\r\n        </div>\r\n    </div>\r\n</form>";

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	var _elementPositioner = __webpack_require__(6);

	var _elementPositioner2 = _interopRequireDefault(_elementPositioner);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var css = _constants2.default.css,
	    margin = {
	    x: 0,
	    y: 0
	};

	var DialogPositioner = function () {
	    function DialogPositioner() {
	        _classCallCheck(this, DialogPositioner);
	    }

	    _createClass(DialogPositioner, [{
	        key: 'setPosition',
	        value: function setPosition($container, $element) {
	            var positioner = new _elementPositioner2.default(margin);
	            positioner.cleanupPosition($element);

	            var position = positioner.getPosition($container, $element);

	            $element.addClass(position.horizontal ? position.horizontal : css.middle);
	            $element.addClass(position.vertical ? position.vertical : css.bottom);
	        }
	    }]);

	    return DialogPositioner;
	}();

	exports.default = DialogPositioner;

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = "<div class=\"review-dialog element-review-dialog\">\r\n    <button class=\"close-dialog-btn\"></button>\r\n    <form class=\"add-comment-form\">\r\n    </form>\r\n</div>";

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	var _commentForm = __webpack_require__(29);

	var _commentForm2 = _interopRequireDefault(_commentForm);

	var _htmlMarkupProvider = __webpack_require__(9);

	var _htmlMarkupProvider2 = _interopRequireDefault(_htmlMarkupProvider);

	var _controls = __webpack_require__(31);

	var _controls2 = _interopRequireDefault(_controls);

	var _dialog = __webpack_require__(36);

	var _dialog2 = _interopRequireDefault(_dialog);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Dialog = function () {
	    function Dialog(onExpansionChanged) {
	        _classCallCheck(this, Dialog);

	        var that = this;
	        this.isExpanded = false;
	        this.commentForm = new _commentForm2.default();
	        this.onExpansionChanged = onExpansionChanged;
	        this.$dialog = $(_htmlMarkupProvider2.default.getHtmlMarkup(_dialog2.default));

	        this.$dialog.find(_constants2.default.selectors.addCommentForm).replaceWith(this.commentForm.$element);

	        var expandCollapseBtn = new _controls2.default.Button(this.$dialog, _constants2.default.selectors.commentsHeader);
	        expandCollapseBtn.click(function () {
	            that.toggleExpansion();
	        });
	    }

	    _createClass(Dialog, [{
	        key: 'show',
	        value: function show() {
	            this.$dialog.appendTo(_constants2.default.selectors.body);
	            this.commentForm.init();
	        }
	    }, {
	        key: 'toggleExpansion',
	        value: function toggleExpansion() {
	            var isExpanded = this.$dialog.hasClass(_constants2.default.css.expanded);
	            this.$dialog.toggleClass(_constants2.default.css.expanded);
	            this.isExpanded = false;

	            if (!isExpanded) {
	                this.commentForm.init();
	                this.isExpanded = true;
	            }

	            this.onExpansionChanged();
	        }
	    }]);

	    return Dialog;
	}();

	exports.default = Dialog;
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

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = "<div class=\"review-dialog general-review-dialog\">\r\n    <div class=\"comments-header\">\r\n        <div class=\"comment-header-text\">{{leaveGeneralComment}}</div>\r\n        <div class=\"comments-expander\"></div>\r\n    </div>\r\n    <form class=\"add-comment-form\">\r\n    </form>\r\n</div>";

/***/ },
/* 37 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MultiEventTracker = function () {
	    function MultiEventTracker(startHandler, endHandler, useFirstTimeTimeout, interval) {
	        _classCallCheck(this, MultiEventTracker);

	        this.startHandler = startHandler;
	        this.endHandler = endHandler;
	        this.useFirstTimeTimeout = useFirstTimeTimeout;
	        this.delta = interval ? interval : 200;
	        this.timeout = false;
	        this.runTime = null;
	    }

	    _createClass(MultiEventTracker, [{
	        key: "eventTrigerred",
	        value: function eventTrigerred() {
	            var that = this;
	            if (this.useFirstTimeTimeout) {
	                setTimeout(function () {
	                    that.handleEvent();
	                }, 0);
	            } else {
	                this.handleEvent();
	            }
	        }
	    }, {
	        key: "handleEvent",
	        value: function handleEvent() {
	            var that = this;
	            this.runTime = new Date();
	            if (this.timeout === false) {
	                if (this.startHandler) {
	                    this.startHandler();
	                }

	                this.timeout = true;
	                setTimeout(function () {
	                    that.eventStoppedTrigerring();
	                }, this.delta);
	            }
	        }
	    }, {
	        key: "eventStoppedTrigerring",
	        value: function eventStoppedTrigerring() {
	            var that = this;
	            if (new Date() - this.runTime < this.delta) {
	                setTimeout(function () {
	                    that.eventStoppedTrigerring();
	                }, this.delta);
	            } else {
	                this.timeout = false;
	                if (this.endHandler) {
	                    this.endHandler();
	                }
	            }
	        }
	    }]);

	    return MultiEventTracker;
	}();

	//var MultiEventTracker = function (startHandler, endHandler, useFirstTimeTimeout, interval) {
	//    var rtime;
	//    var timeout = false;
	//    var delta = interval ? interval : 200;

	//    function eventTrigerred(){
	//        if (useFirstTimeTimeout) {
	//            setTimeout(function() {
	//                eventHandler();
	//            }, 0);
	//        }else {
	//            eventHandler();
	//        }
	//    }

	//    function eventHandler(){
	//        rtime = new Date();
	//        if (timeout === false) {
	//            if (startHandler) {
	//                startHandler();
	//            }

	//            timeout = true;
	//            setTimeout(eventStoppedTrigerring, delta);
	//        }
	//    }

	//    function eventStoppedTrigerring() {
	//        if (new Date() - rtime < delta) {
	//            setTimeout(eventStoppedTrigerring, delta);
	//        } else {
	//            timeout = false;
	//            if (endHandler) {
	//                endHandler();
	//            }
	//        }
	//    }

	//    return {
	//        eventTrigerred: eventTrigerred
	//    };
	//};

	exports.default = MultiEventTracker;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _multiEventTracker = __webpack_require__(37);

	var _multiEventTracker2 = _interopRequireDefault(_multiEventTracker);

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EventTracker = function () {
	    function EventTracker() {
	        _classCallCheck(this, EventTracker);
	    }

	    _createClass(EventTracker, [{
	        key: 'trackWindowResize',
	        value: function trackWindowResize(resizeStartedHandler, resizeFinishedHandler) {
	            var multiEventTracker = new _multiEventTracker2.default(resizeStartedHandler, resizeFinishedHandler);

	            $(window).resize(function () {
	                multiEventTracker.eventTrigerred();
	            });
	        }
	    }, {
	        key: 'trackWindowScroll',
	        value: function trackWindowScroll(handler) {
	            $(window).scroll(function () {
	                handler();
	            });
	        }
	    }]);

	    return EventTracker;
	}();

	exports.default = EventTracker;

/***/ },
/* 39 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
	 * directory of this distribution and at
	 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
	 */
	;
	(function () {

	    /**
	     * Class for dimension change detection.
	     *
	     * @param {Element|Element[]|Elements|jQuery} element
	     * @param {Function} callback
	     *
	     * @constructor
	     */
	    window.ResizeSensor = function (element, callback) {
	        /**
	         *
	         * @constructor
	         */
	        function EventQueue() {
	            this.q = [];
	            this.add = function (ev) {
	                this.q.push(ev);
	            };

	            var i, j;
	            this.call = function () {
	                for (i = 0, j = this.q.length; i < j; i++) {
	                    this.q[i].call();
	                }
	            };
	        }

	        /**
	         * @param {HTMLElement} element
	         * @param {String}      prop
	         * @returns {String|Number}
	         */
	        function getComputedStyle(element, prop) {
	            if (element.currentStyle) {
	                return element.currentStyle[prop];
	            } else if (window.getComputedStyle) {
	                return window.getComputedStyle(element, null).getPropertyValue(prop);
	            } else {
	                return element.style[prop];
	            }
	        }

	        /**
	         *
	         * @param {HTMLElement} element
	         * @param {Function}    resized
	         */
	        function attachResizeEvent(element, resized) {
	            if (!element.resizedAttached) {
	                element.resizedAttached = new EventQueue();
	                element.resizedAttached.add(resized);
	            } else if (element.resizedAttached) {
	                element.resizedAttached.add(resized);
	                return;
	            }

	            element.resizeSensor = document.createElement('div');
	            element.resizeSensor.className = 'resize-sensor';
	            var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;';
	            var styleChild = 'position: absolute; left: 0; top: 0;';

	            element.resizeSensor.style.cssText = style;
	            element.resizeSensor.innerHTML = '<div class="resize-sensor-expand" style="' + style + '">' + '<div style="' + styleChild + '"></div>' + '</div>' + '<div class="resize-sensor-shrink" style="' + style + '">' + '<div style="' + styleChild + ' width: 200%; height: 200%"></div>' + '</div>';
	            element.appendChild(element.resizeSensor);

	            if (!{ fixed: 1, absolute: 1 }[getComputedStyle(element, 'position')]) {
	                element.style.position = 'relative';
	            }

	            var expand = element.resizeSensor.childNodes[0];
	            var expandChild = expand.childNodes[0];
	            var shrink = element.resizeSensor.childNodes[1];

	            var lastWidth, lastHeight;

	            var reset = function reset() {
	                expandChild.style.width = expand.offsetWidth + 10 + 'px';
	                expandChild.style.height = expand.offsetHeight + 10 + 'px';
	                expand.scrollLeft = expand.scrollWidth;
	                expand.scrollTop = expand.scrollHeight;
	                shrink.scrollLeft = shrink.scrollWidth;
	                shrink.scrollTop = shrink.scrollHeight;
	                lastWidth = element.offsetWidth;
	                lastHeight = element.offsetHeight;
	            };

	            reset();

	            var changed = function changed() {
	                if (element.resizedAttached) {
	                    element.resizedAttached.call();
	                }
	            };

	            var addEvent = function addEvent(el, name, cb) {
	                if (el.attachEvent) {
	                    el.attachEvent('on' + name, cb);
	                } else {
	                    el.addEventListener(name, cb);
	                }
	            };

	            var onScroll = function onScroll() {
	                if (element.offsetWidth != lastWidth || element.offsetHeight != lastHeight) {
	                    changed();
	                }
	                reset();
	            };

	            addEvent(expand, 'scroll', onScroll);
	            addEvent(shrink, 'scroll', onScroll);
	        }

	        var elementType = Object.prototype.toString.call(element);
	        var isCollectionTyped = '[object Array]' === elementType || '[object NodeList]' === elementType || '[object HTMLCollection]' === elementType || 'undefined' !== typeof jQuery && element instanceof jQuery //jquery
	         || 'undefined' !== typeof Elements && element instanceof Elements //mootools
	        ;

	        if (isCollectionTyped) {
	            var i = 0,
	                j = element.length;
	            for (; i < j; i++) {
	                attachResizeEvent(element[i], callback);
	            }
	        } else {
	            attachResizeEvent(element, callback);
	        }

	        this.detach = function () {
	            if (isCollectionTyped) {
	                var i = 0,
	                    j = element.length;
	                for (; i < j; i++) {
	                    ResizeSensor.detach(element[i]);
	                }
	            } else {
	                ResizeSensor.detach(element);
	            }
	        };
	    };

	    window.ResizeSensor.detach = function (element) {
	        if (element.resizeSensor) {
	            element.removeChild(element.resizeSensor);
	            delete element.resizeSensor;
	            delete element.resizedAttached;
	        }
	    };
	})();

/***/ },
/* 40 */
/***/ function(module, exports) {

	'use strict';

	(function () {
	    'use strict';

	    function BranchtrackProvider() {
	        var instances = {},
	            messageProvider = 'branchtrack',
	            supportedMessageTypes = {
	            init: 'branchtrack:player:init', //first time init
	            start: 'branchtrack:player:start', //start of playing, t.i. before first scene appear, including on restart
	            scene: 'branchtrack:player:scene', //new scene shown
	            choice: 'branchtrack:player:choice', //user hit the choice
	            finish: 'branchtrack:player:finish' //user reached last scene
	        };

	        return {
	            create: createInstance,
	            destroy: destroyInstance,
	            instances: instances
	        };

	        function createInstance(projectId) {
	            if (!projectId) {
	                return;
	            }

	            if (isEmpty(instances)) {
	                subscribeMessageEvent();
	            }

	            var branchtrack = new BranchtrackInstance(projectId);

	            instances[projectId] = branchtrack;
	            return branchtrack;
	        }

	        function destroyInstance(instance) {
	            if (typeof instances[instance.projectId] !== 'undefined') {
	                delete instances[instance.projectId];
	            }

	            if (isEmpty(instances)) {
	                unsubscribeMessageEvent();
	            }
	        }

	        function subscribeMessageEvent() {
	            window.addEventListener('message', messageEventHadler);
	        }

	        function unsubscribeMessageEvent() {
	            window.removeEventListener('message', messageEventHadler);
	        }

	        function messageEventHadler(event) {
	            var data = JSON.parse(event.data);
	            if (data.provider !== messageProvider) {
	                return;
	            }
	            var projectId = data.details.project.permalink,
	                messageDataType = data.type,
	                branchtrackInstance = instances[projectId];

	            if (typeof branchtrackInstance === 'undefined' || branchtrackInstance === null) {
	                return;
	            }

	            if (messageDataType === supportedMessageTypes.scene && data.details.scene.score > 0) {
	                branchtrackInstance.score = data.details.scene.score;
	            }

	            if (messageDataType === supportedMessageTypes.finish) {
	                branchtrackInstance.isFinished = true;
	            }
	        }

	        function isEmpty(obj) {
	            for (var key in obj) {
	                if (Object.prototype.hasOwnProperty.call(obj, key)) {
	                    return false;
	                }
	            }

	            return true;
	        }
	    }

	    window.Branchtrack = BranchtrackProvider();

	    function BranchtrackInstance(projectId) {
	        this.projectId = projectId;
	        this.score = 0;
	        this.isFinished = false;
	    }

	    BranchtrackInstance.prototype = {
	        reset: function reset() {
	            this.score = 0;
	            this.isFinished = false;
	        },
	        destroy: function destroy() {
	            window.Branchtrack.destroy(this);
	        }
	    };
	})();

/***/ },
/* 41 */
/***/ function(module, exports) {

	'use strict';

	(function () {
	    'use strict';

	    var classList = {
	        tooltipWrapper: 'tl-wrapper',
	        tooltipArrowWrapper: 'tl-arrow-wrapper',
	        tooltipArrow: 'tl-arrow',
	        tooltipTextWrapper: 'tl-text-wrapper',
	        top: 'top',
	        bottom: 'bottom',
	        infoContainer: 'info-container',
	        mouseover: 'mouseover'
	    };

	    var isTouchDevice = function isTouchDevice() {
	        return 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
	    },
	        getElementsByAttribute = function getElementsByAttribute(parent, attr) {
	        var matchingElements = [];
	        var allElements = parent.getElementsByTagName('*');
	        for (var i = 0, l = allElements.length; i < l; i++) {
	            if (allElements[i].getAttribute(attr) !== null) {
	                matchingElements.push(allElements[i]);
	            }
	        }
	        return matchingElements;
	    },
	        defer = function defer(callback) {
	        setTimeout(function () {
	            if (typeof callback === 'function') {
	                callback();
	            }
	        });
	    },
	        config = {
	        useContainerOffsetLeft: false,
	        units: 'px'
	    };

	    var Tooltip = function () {
	        var tooltip;

	        function init() {
	            var domElement = 'div',
	                tooltipElement = document.createElement(domElement),
	                arrowWrapper = document.createElement(domElement),
	                arrow = document.createElement(domElement),
	                textWrapper = document.createElement(domElement);

	            buildMarkup();

	            bindEvents();

	            return {
	                show: show,
	                hide: hide,
	                element: tooltipElement
	            };

	            function show(container, element, text) {
	                if (text !== '') {
	                    container.appendChild(tooltipElement);
	                    textWrapper.textContent = text;
	                    arrow.style.display = 'block';
	                    tooltipElement.style.display = 'block';
	                    var infoContainer = element.getElementsByClassName(classList.infoContainer)[0],
	                        infoContainerHeight = infoContainer.offsetHeight - 5,
	                        arrowHalfWidth = 0,
	                        windowWidth = window.innerWidth,
	                        browserScrollWidth = 20,
	                        spotBounds = {
	                        width: element.offsetWidth,
	                        height: element.offsetHeight,
	                        clientTop: element.getBoundingClientRect().top,
	                        clientLeft: element.getBoundingClientRect().left,
	                        top: element.offsetTop,
	                        left: element.offsetLeft,
	                        centerPosition: {
	                            top: element.offsetTop + element.offsetHeight / 2,
	                            left: element.offsetLeft + element.offsetWidth / 2
	                        }
	                    },
	                        tooltipBounds = {
	                        width: tooltipElement.offsetWidth,
	                        heigth: tooltipElement.offsetHeight,
	                        top: 0,
	                        left: 0
	                    },
	                        tooltipClientRect = null;

	                    if (tooltipBounds.heigth < spotBounds.clientTop + infoContainerHeight) {
	                        tooltipElement.classList.remove(classList.bottom);
	                        tooltipElement.classList.add(classList.top);
	                        tooltipBounds.top = spotBounds.centerPosition.top - infoContainerHeight - tooltipBounds.heigth;
	                    } else {
	                        tooltipElement.classList.remove(classList.top);
	                        tooltipElement.classList.add(classList.bottom);
	                        tooltipBounds.top = spotBounds.centerPosition.top + infoContainerHeight;
	                    }

	                    arrowHalfWidth = arrow.offsetWidth / 2;
	                    tooltipElement.style.top = tooltipBounds.top + config.units;

	                    tooltipBounds.left = spotBounds.centerPosition.left - tooltipBounds.width * 0.5;
	                    arrow.style.left = spotBounds.centerPosition.left - tooltipBounds.left - arrowHalfWidth + config.units;

	                    tooltipElement.style.left = tooltipBounds.left + config.units;
	                    tooltipClientRect = tooltipElement.getBoundingClientRect();
	                    if (tooltipClientRect.bottom > window.innerHeight) {
	                        tooltipElement.style.top = tooltipBounds.top - (tooltipClientRect.bottom - window.innerHeight) + config.units;
	                        arrow.style.display = 'none';
	                    }

	                    var tempLeft = tooltipBounds.left;

	                    if (tooltipClientRect.left < 0) {
	                        tooltipBounds.left = tempLeft - tooltipClientRect.left;
	                        tooltipElement.style.left = tooltipBounds.left + config.units;
	                        arrow.style.left = spotBounds.centerPosition.left - tempLeft + tooltipClientRect.left - arrowHalfWidth + config.units;
	                    }if (tooltipClientRect.right > windowWidth) {
	                        tooltipBounds.left = tempLeft + (windowWidth - tooltipClientRect.right) - browserScrollWidth;
	                        tooltipElement.style.left = tooltipBounds.left + config.units;
	                        arrow.style.left = spotBounds.centerPosition.left - tempLeft - (windowWidth - tooltipClientRect.right) + browserScrollWidth - arrowHalfWidth + config.units;
	                    }

	                    if (config.useContainerOffsetLeft) {
	                        if (tooltipBounds.left + container.offsetLeft < 0) {
	                            tooltipElement.style.left = tooltipBounds.left + container.offsetLeft + config.units;
	                            arrow.style.left = parseInt(arrow.style.left) - container.offsetLeft + config.units;
	                        }
	                    }
	                }
	            }

	            function hide() {
	                var parentNode = tooltipElement.parentNode;
	                tooltipElement.classList.remove(classList.bottom);
	                tooltipElement.classList.remove(classList.top);
	                if (parentNode) {
	                    parentNode.removeChild(tooltipElement);
	                } else {
	                    tooltipElement.style.display = 'block';
	                }
	            }

	            function buildMarkup() {
	                tooltipElement.classList.add(classList.tooltipWrapper);
	                arrowWrapper.classList.add(classList.tooltipArrowWrapper);
	                arrow.classList.add(classList.tooltipArrow);
	                textWrapper.classList.add(classList.tooltipTextWrapper);

	                arrowWrapper.appendChild(arrow);
	                tooltipElement.appendChild(arrowWrapper);
	                tooltipElement.appendChild(textWrapper);
	            }

	            function bindEvents() {
	                window.addEventListener('resize', function () {
	                    hide();
	                });

	                if (isTouchDevice()) {
	                    tooltipElement.addEventListener('click', function (event) {
	                        event.stopPropagation();
	                    });
	                    document.addEventListener('click', function (event) {
	                        hide();
	                    });
	                } else {
	                    tooltipElement.addEventListener('mouseenter', function () {
	                        tooltipElement.classList.add(classList.mouseover);
	                    });

	                    tooltipElement.addEventListener('mouseleave', function (event) {
	                        tooltipElement.classList.remove(classList.mouseover);
	                        hide();
	                    });
	                }
	            }
	        }

	        return {
	            getInstance: function getInstance() {
	                if (!tooltip) {
	                    tooltip = init();
	                }
	                return tooltip;
	            }
	        };
	    }();

	    var Spot = function Spot(element, container, ratio) {
	        var that = this;
	        that.element = element;
	        that.defaultTopStyle = parseFloat(element.style.top);
	        that.defaultLeftStyle = parseFloat(element.style.left);
	        that.defaultWidthStyle = parseFloat(element.style.width);
	        that.defaultHeightStyle = parseFloat(element.style.height);
	        that.text = element.getAttribute('data-text');

	        var tooltip = Tooltip.getInstance();

	        that.hide = function () {
	            element.style.display = 'none';
	        };

	        that.show = function () {
	            that.element.style.display = 'inline-block';
	        };

	        that.updatePosition = function (ratio) {
	            that.element.style.top = that.defaultTopStyle * ratio + config.units;
	            that.element.style.left = that.defaultLeftStyle * ratio + config.units;
	            that.element.style.width = that.defaultWidthStyle * ratio + config.units;
	            that.element.style.height = that.defaultHeightStyle * ratio + config.units;
	        };

	        init();

	        function init() {
	            if (that.text !== '' && typeof that.text !== 'undefined') {
	                var infoElement = document.createElement('span');
	                infoElement.classList.add(classList.infoContainer);
	                that.element.appendChild(infoElement);
	                that.hide();
	                if (isTouchDevice()) {
	                    that.element.addEventListener('click', function (event) {
	                        tooltip.show(container, that.element, that.text);
	                        event.stopPropagation();
	                    });
	                } else {

	                    that.element.addEventListener('mouseenter', function (event) {
	                        defer(function () {
	                            tooltip.show(container, that.element, that.text);
	                        });
	                    });

	                    that.element.addEventListener('mouseleave', function (event) {
	                        var e = event.toElement || event.relatedTarget;
	                        if (e && e == tooltip.element) {
	                            return;
	                        }

	                        defer(function () {
	                            if (!tooltip.element.classList.contains(classList.mouseover)) {
	                                tooltip.hide();
	                            }
	                        });
	                    });
	                }
	            }
	        }
	    };

	    window.HotspotOnImage = function (element, settings) {
	        var that = this,
	            resizeTimer,
	            refreshRate = 250,
	            settings = settings || {};
	        that.element = element;
	        that.renderedImage = that.element.getElementsByTagName('img')[0];
	        that.spots = [];
	        that.ratio = 1;
	        that.defaultImageWidth = 0;

	        if (typeof settings.useContainerOffsetLeft !== 'undefined') {
	            config.useContainerOffsetLeft = settings.useContainerOffsetLeft;
	        }

	        init();

	        function init() {
	            generateSpots();
	            loadImage();
	        }

	        function loadImage() {
	            var image = new Image();
	            image.onload = function () {
	                that.defaultImageWidth = this.width;
	                that.ratio = that.renderedImage.offsetWidth / that.defaultImageWidth;
	                updateSpotsPosition();
	            };
	            image.src = that.renderedImage.getAttribute('src');
	        }

	        function generateSpots() {
	            var spots = getElementsByAttribute(that.element, 'data-id');
	            eachSpots(spots, function (spot) {
	                that.spots.push(new Spot(spot, that.element, that.ratio));
	            });
	        }

	        function updateSpotsPosition() {
	            that.ratio = that.renderedImage.offsetWidth / that.defaultImageWidth;
	            eachSpots(that.spots, function (spot) {
	                spot.updatePosition(that.ratio);
	                spot.show();
	            });
	        }

	        function eachSpots(spots, callback) {
	            var spotsLength = spots.length;
	            for (var i = 0; i < spotsLength; i++) {
	                if (typeof callback === 'function') {
	                    callback.call(this, spots[i]);
	                }
	            }
	        }

	        window.addEventListener('resize', function () {
	            eachSpots(that.spots, function (spot) {
	                spot.hide();
	            });
	            clearTimeout(resizeTimer);
	            resizeTimer = setTimeout(updateSpotsPosition, 250);
	        });
	    };
	})();

/***/ },
/* 42 */
/***/ function(module, exports) {

	'use strict';

	(function (supportedBrowser) {
		var options = {};

		supportedBrowser.configure = function (configurationOptions) {
			options.browsers = configurationOptions.browsers || {};
			options.browsers.win = extend(configurationOptions.browsers.win || {}, configurationOptions.globalBrowsersInfo);
			options.browsers.mac = extend(configurationOptions.browsers.mac || {}, configurationOptions.globalBrowsersInfo);
			options.browsers.linux = extend(configurationOptions.browsers.linux || {}, configurationOptions.globalBrowsersInfo);
			options.browsers.android = extend(configurationOptions.browsers.android || {}, configurationOptions.globalBrowsersInfo);
			options.browsers.ios = extend(configurationOptions.browsers.ios || {}, configurationOptions.globalBrowsersInfo);
			options.browsers.winphone = extend(configurationOptions.browsers.winphone || {}, configurationOptions.globalBrowsersInfo);
			options.browsers.blackberry = extend(configurationOptions.browsers.blackberry || {}, configurationOptions.globalBrowsersInfo);

			options.mainAppContainerId = configurationOptions.mainAppContainerId;
			options.debug = configurationOptions.debug;

			return supportedBrowser;
		};

		supportedBrowser.init = function () {
			if (!isBrowserSupported()) {
				hideMainApp();
				renderNotSupportedView();
			}

			if (options.debug) {
				var browser = detectBrowser();
				alert('Browser: ' + browser.name + '\nVersion: ' + browser.version + '\nPlatform: ' + browser.platform + '\n\nUser agent: \n' + navigator.userAgent);
			}

			return supportedBrowser;
		};

		supportedBrowser.isBrowserSupported = isBrowserSupported;

		function extend(targetBrowsers, globalBrowsers) {
			var result = targetBrowsers;

			for (var browser in targetBrowsers) {
				if (!globalBrowsers[browser]) {
					continue;
				}

				targetBrowsers[browser].image = targetBrowsers[browser].image || globalBrowsers[browser].image || null;
				targetBrowsers[browser].title = targetBrowsers[browser].title || globalBrowsers[browser].title || null;
				targetBrowsers[browser].link = targetBrowsers[browser].link || globalBrowsers[browser].link || null;
				targetBrowsers[browser].version = targetBrowsers[browser].version || globalBrowsers[browser].version || null;
			}

			return result;
		}

		function isBrowserSupported() {
			var browserInfo = detectBrowser();

			if (!browserInfo.name || !browserInfo.version || !browserInfo.platform) {
				return false;
			}

			var browser = options.browsers[browserInfo.platform][browserInfo.name];
			return browser && (!browser.version || browser.version <= browserInfo.version);
		}

		function hideMainApp() {
			var mainAppContainer = getById(options.mainAppContainerId),
			    htmlContainer = document.getElementsByTagName("html")[0],
			    bodyContainer = document.getElementsByTagName("body")[0];

			supportedBrowser.originalPageStyles = {
				mainContainerDisplay: mainAppContainer.style.display,
				htmlContainerHeight: htmlContainer.style.height,
				bodyContainerHeight: bodyContainer.style.height
			};

			mainAppContainer.style.display = 'none';
			htmlContainer.style.height = '100%';
			bodyContainer.style.height = '100%';
		}

		function showMainApp() {
			getById(options.mainAppContainerId).style.display = supportedBrowser.originalPageStyles.mainContainerDisplay;
			document.getElementsByTagName("html")[0].style.height = supportedBrowser.originalPageStyles.htmlContainerHeight;
			document.getElementsByTagName("body")[0].style.height = supportedBrowser.originalPageStyles.bodyContainerHeight;
		}

		function detectBrowser() {
			var ua = navigator.userAgent,
			    matches = ua.match(/(opera|chrome|safari|firefox|msie|trident|opios|crios(?=\/))\/?\s*(\d+)/i) || [],
			    browserName = matches[1],
			    version = matches[2],
			    temp;

			// detect platform
			var platform = (/(ipad)/i.exec(ua) || /(ipod)/i.exec(ua) || /(iphone)/i.exec(ua) || /(android)/i.exec(ua) || /(windows phone)/i.exec(ua) || /(win)/i.exec(ua) || /(mac)/i.exec(ua) || /(linux)/i.exec(ua) || /(blackberry)/i.exec(ua) || [])[0];

			if (/(ipad|ipod|iphone)/i.exec(platform)) {
				platform = 'ios';
			} else if (/(windows phone)/i.exec(platform)) {
				platform = 'winphone';
			}

			if (!matches[2]) {
				browserName = navigator.appName;
				version = navigator.appVersion;
			}
			if ((temp = ua.match(/version\/(\d+)/i)) != null) {
				version = temp[1];
			}

			// hacks
			if (/edge\/(\d+)/.exec(ua.toLowerCase())) {
				browserName = 'edge';
			} else if (/(trident)/i.exec(browserName)) {
				temp = /\brv[ :]+(\d+)/g.exec(ua) || [];
				browserName = 'msie';
				version = temp[1] || '';
			} else if (/(android)/i.exec(platform) && /(safari)/i.exec(browserName) || /(android)/i.exec(platform) && /(chrome)/i.exec(browserName) && /(version)/i.exec(ua)) {
				browserName = 'native';
			} else if (/(chrome)/i.exec(browserName)) {
				temp = ua.match(/\bOPR\/(\d+)/);
				if (temp != null) {
					browserName = 'opera';
					version = temp[1] || '';
				}
			} else if (/(crios)/i.exec(browserName)) {
				browserName = 'chrome';
			} else if (/(opios)/i.exec(browserName)) {
				browserName = 'opera';
			}

			return {
				name: browserName.toLowerCase(),
				version: version,
				platform: (platform || '').toLowerCase()
			};
		}

		function renderNotSupportedView() {
			var notSupportedViewHtml = '<table class="not-supported-page-bg-table" border="0" cellpadding="0" cellspacing="0">\
		            <tr>\
		                <td class="not-supported-page-top-bg" colspan="2">&nbsp;</td>\
		            </tr>\
		            <tr>\
		                <td colspan="2">\
		                    <div class="not-supported-page-toothed-bg">&nbsp;</div>\
		                </td>\
		            </tr>\
		            <tr>\
		                <td class="not-supported-page-bottom-bg" colspan="2">&nbsp;</td>\
		            </tr>\
		        </table>\
		        <table class="not-supported-page-markup-table" border="0" cellpadding="0" cellspacing="0">\
		            <tr>\
		                <td colspan="3" class="not-supported-page-logo-wrapper">\
		                    <div class="not-supported-page-logo">&nbsp;</div>\
		                </td>\
		            </tr>\
		            <tr>\
		                <td>&nbsp;</td>\
		                <td class="not-supported-page-content-cell">\
		                    <div class="not-supported-page-content">\
		                        <h1 class="not-supported-page-caption">We can\'t guarantee that easygenerator will work perfectly on your current browser</h1>\
		                        <a href="" id="skip-not-supported-page" class="not-supported-page-try-anyway-link">I still want to continue</a>\
		                        <p class="not-supported-page-caption-description">We recommend that you upgrade your browser or use a fully supported browser. Click one of this icons below to install or upgrade.</p>\
		                        <table class="supported-browsers-group" border="0" cellpadding="0" cellspacing="0">\
		                            <tr>\
		                                <td>&nbsp;</td>\
										{0}\
		                                <td>&nbsp;</td>\
		                            </tr>\
		                        </table>\
		                    </div>\
		                </td>\
		                <td>&nbsp;</td>\
		            </tr>\
		            <tr>\
		                <td>\
		                    <div class="not-supported-page-bottom-aligner">&nbsp;</div>\
		                </td>\
		                <td>&nbsp;</td>\
		                <td>&nbsp;</td>\
		            </tr>\
		        </table>';

			var browserInfo = detectBrowser(),
			    supportedBrowsers = options.browsers[browserInfo.platform];

			var supportedBrowsersListHtml = '';
			for (var browserName in supportedBrowsers) {
				var browser = supportedBrowsers[browserName];

				if (browser.link) {
					supportedBrowsersListHtml += '<td class="supported-browser-item">\
				            <a href="' + browser.link + '" class="supported-browser-container with-link" target="_blank">\
				                <img class="supported-browser-image" src="' + browser.image + '" alt="">\
				                <p class="supported-browser-title-wrapper">\
				                    <span class="supported-browser-title">' + browser.title + '</span>\
				                </p>\
				            </a>\
				        </td>';
				} else {
					supportedBrowsersListHtml += '<td class="supported-browser-item">\
				            <div class="supported-browser-container">\
				                <img class="supported-browser-image" src="' + browser.image + '" alt="">\
				                <p class="supported-browser-title-wrapper">\
				                    <span class="supported-browser-title">' + browser.title + '</span>\
				                </p>\
				            </div>\
				        </td>';
				}
			}

			notSupportedViewHtml = notSupportedViewHtml.replace('{0}', supportedBrowsersListHtml);

			var notSupportedView = document.createElement('div');
			notSupportedView.innerHTML = notSupportedViewHtml;
			notSupportedView.id = 'not-supported-page';

			var body = document.getElementsByTagName('body')[0];
			body.appendChild(notSupportedView);

			getById('skip-not-supported-page').onclick = function () {
				notSupportedView.style.display = 'none';
				showMainApp();
				return false;
			};

			return notSupportedView;
		}

		function getById(id) {
			return document.getElementById(id);
		}
	})(window.supportedBrowser = window.supportedBrowser || {});

/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';

	(function () {
	    if (!WebFont) {
	        var wf = document.createElement('script');
	        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	        wf.type = 'text/javascript';
	        var s = document.getElementsByTagName('script')[0];
	        s.parentNode.insertBefore(wf, s);
	    }

	    WebFont.load({
	        google: {
	            families: ['Open+Sans:400,600:latin,cyrillic-ext']
	        }
	    });
	})();

/***/ },
/* 44 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 50 */,
/* 51 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);