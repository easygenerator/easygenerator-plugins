webpackJsonp([0,1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _reviewService = __webpack_require__(1);

	var _reviewService2 = _interopRequireDefault(_reviewService);

	var _hintController = __webpack_require__(2);

	var _hintController2 = _interopRequireDefault(_hintController);

	var _spotController = __webpack_require__(20);

	var _spotController2 = _interopRequireDefault(_spotController);

	var _ReviewDialogController = __webpack_require__(24);

	var _ReviewDialogController2 = _interopRequireDefault(_ReviewDialogController);

	var _windowEventTracker = __webpack_require__(34);

	var _windowEventTracker2 = _interopRequireDefault(_windowEventTracker);

	var _localizationService = __webpack_require__(8);

	var _localizationService2 = _interopRequireDefault(_localizationService);

	var _review = __webpack_require__(35);

	var _review2 = _interopRequireDefault(_review);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Plugin = function Plugin() {
	    var spotController = null,
	        hintController = null,
	        dialogController = null;

	    function init(settings) {
	        debugger;
	        if ($ === undefined) {
	            throw 'Easygenerator review requires jQuery';
	        }

	        if (!settings) {
	            throw 'Failed to initialize review plugin. Settings are not defined.';
	        }

	        if (!settings.locale) {
	            throw 'Failed to initialize review plugin. Settings locale is not defined.';
	        }

	        if (!settings.reviewApiUrl) {
	            throw 'Failed to initialize review plugin. Review api url is invalid.';
	        }

	        if (!settings.courseId) {
	            throw 'Failed to initialize review plugin. Course id is invalid.';
	        }

	        _localizationService2.default.init(settings.locale);

	        var reviewService = new _reviewService2.default(settings.reviewApiUrl, settings.courseId);
	        hintController = new _hintController2.default(), dialogController = new _ReviewDialogController2.default(reviewService, hintController), spotController = new _spotController2.default(hintController, dialogController);

	        var windowEventTracker = new _windowEventTracker2.default();

	        windowEventTracker.trackWindowResize(function () {
	            spotController.hideSpots();
	            hintController.hideHints();
	        }, function () {
	            spotController.showSpots();
	            hintController.showHintsIfNeeded();
	            dialogController.updatePositionIfNeeded();
	        });

	        dialogController.showGeneralReviewDialog();
	    }

	    function renderSpots() {
	        if (!spotController || !hintController) {
	            throw 'Easygenerator review plugin is not initialized.';
	        }

	        spotController.renderSpots();
	        hintController.showHintsIfNeeded();
	    }

	    return {
	        init: init,
	        renderSpots: renderSpots
	    };
	};

	window.easygeneratorPlugins = {
	    ReviewPlugin: Plugin
	};

	module.exports = Plugin;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	var ReviewService = function ReviewService(reviewApiUrl, courseId) {
	    function postComment(message, username, useremail) {
	        return $.ajax({
	            url: getApiUrl('api/comment/create'),
	            data: { courseId: courseId, text: message.trim(), createdByName: username.trim(), createdBy: useremail.trim() },
	            type: 'POST'
	        });
	    }

	    function getApiUrl(apiPath) {
	        if (reviewApiUrl.indexOf('/', reviewApiUrl.length - 1) !== -1) {
	            return reviewApiUrl + apiPath;
	        }

	        return reviewApiUrl + '/' + apiPath;
	    }

	    return {
	        postComment: postComment
	    };
	};

	module.exports = ReviewService;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _hint = __webpack_require__(3);

	var _hint2 = _interopRequireDefault(_hint);

	var _constants = __webpack_require__(6);

	var _constants2 = _interopRequireDefault(_constants);

	var _clientContext = __webpack_require__(19);

	var _clientContext2 = _interopRequireDefault(_clientContext);

	var _localizationService = __webpack_require__(8);

	var _localizationService2 = _interopRequireDefault(_localizationService);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var HintController = function HintController() {
	    var spotReviewHint = new _hint2.default(_localizationService2.default.localize('elementReviewHint'), _constants2.default.css.spotReviewHint, function () {
	        hideSpotReviewHint();
	    }),
	        generalReviewHint = new _hint2.default(_localizationService2.default.localize('generalReviewHint'), _constants2.default.css.generalReviewHint + ' ' + _constants2.default.css.top, function () {
	        hideGeneralReviewHint();
	    });

	    function showSpotReviewHint($spot) {
	        spotReviewHint.show($spot);
	    }

	    function hideSpotReviewHint() {
	        spotReviewHint.hide();
	        _clientContext2.default.set(_constants2.default.clientContextKeys.reviewSpotHintShown, true);

	        showHintsIfNeeded();
	    }

	    function showGeneralReviewHint() {
	        generalReviewHint.show();
	    }

	    function hideGeneralReviewHint() {
	        generalReviewHint.hide();
	        _clientContext2.default.set(_constants2.default.clientContextKeys.reviewGeneralHintShown, true);

	        showHintsIfNeeded();
	    }

	    function isSpotReviewHintShown() {
	        return spotReviewHint.isShown;
	    }

	    function isGeneralReviewHintShown() {
	        return generalReviewHint.isShown;
	    }

	    function showHintsIfNeeded() {
	        if (generalReviewHint.isShown) return;

	        if (spotReviewHint.isShown) {
	            spotReviewHint.hide();
	        }

	        if (_clientContext2.default.get(_constants2.default.clientContextKeys.reviewSpotHintShown) !== true) {
	            var $spots = $(_constants2.default.selectors.reviewSpotWrapper);
	            if ($spots.length > 0) {
	                showSpotReviewHint($($spots[0]));
	                return;
	            }
	        }

	        if (_clientContext2.default.get(_constants2.default.clientContextKeys.reviewGeneralHintShown) !== true) {
	            showGeneralReviewHint();
	        }
	    }

	    function hideHints() {
	        spotReviewHint.hide();
	        generalReviewHint.hide();
	    }

	    return {
	        isSpotReviewHintShown: isSpotReviewHintShown,
	        isGeneralReviewHintShown: isGeneralReviewHintShown,
	        showSpotReviewHint: showSpotReviewHint,
	        showGeneralReviewHint: showGeneralReviewHint,
	        hideSpotReviewHint: hideSpotReviewHint,
	        hideGeneralReviewHint: hideGeneralReviewHint,
	        showHintsIfNeeded: showHintsIfNeeded,
	        hideHints: hideHints
	    };
	};

	module.exports = HintController;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _hintPositioner = __webpack_require__(4);

	var _hintPositioner2 = _interopRequireDefault(_hintPositioner);

	var _constants = __webpack_require__(6);

	var _constants2 = _interopRequireDefault(_constants);

	var _htmlMarkupProvider = __webpack_require__(7);

	var _htmlMarkupProvider2 = _interopRequireDefault(_htmlMarkupProvider);

	var _reviewHint = __webpack_require__(18);

	var _reviewHint2 = _interopRequireDefault(_reviewHint);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Hint = function Hint(text, css, gotItHandler) {
	    var html = _htmlMarkupProvider2.default.getHtmlMarkup(_reviewHint2.default),
	        $hint = $(html),
	        $body = $(_constants2.default.selectors.body),
	        hintPositioner = new _hintPositioner2.default(),
	        hint = {
	        isShown: false,
	        show: show,
	        hide: hide,
	        $element: $hint
	    };

	    $hint.addClass(css);
	    $hint.find(_constants2.default.selectors.reviewHintText).text(text);
	    $hint.find(_constants2.default.selectors.reviewHitnBtn).click(gotItHandler);

	    return hint;

	    function show($spot) {
	        $hint.appendTo($body);
	        if ($spot) {
	            hintPositioner.updatePosition($spot, hint);
	        }

	        $hint.addClass(_constants2.default.css.shown);
	        hint.isShown = true;
	    }

	    function hide() {
	        if (!hint.isShown) return;

	        $hint.removeClass(_constants2.default.css.shown);
	        $hint.detach();
	        hint.isShown = false;
	    }
	};

	module.exports = Hint;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _elementPositioner = __webpack_require__(5);

	var _elementPositioner2 = _interopRequireDefault(_elementPositioner);

	var _constants = __webpack_require__(6);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var HintPositioner = function HintPositioner() {
	    var css = _constants2.default.css,
	        margin = {
	        x: 6,
	        y: 6
	    },
	        positioner = new _elementPositioner2.default(margin);

	    function updatePosition($contextElement, hint) {
	        var $element = hint.$element;
	        positioner.cleanupPosition($element);

	        var horizontalPosition = positioner.getHorizontalPosition($contextElement, $element);
	        if (horizontalPosition) {
	            setCoordinates($contextElement, $element, horizontalPosition);
	            $element.addClass(horizontalPosition);
	            return;
	        }

	        var verticalPosition = positioner.getVerticalPosition($contextElement, $element);
	        if (verticalPosition) {
	            setCoordinates($contextElement, $element, verticalPosition);
	            $element.addClass(verticalPosition);
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

	module.exports = HintPositioner;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(6);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ElementPositioner = function ElementPositioner(margin) {
	    var css = _constants2.default.css,
	        elementSize = null,
	        containerSize = null,
	        $windowContainer = $(_constants2.default.selectors.body);

	    function cleanupPosition($element) {
	        $element.removeClass(css.top);
	        $element.removeClass(css.bottom);
	        $element.removeClass(css.left);
	        $element.removeClass(css.right);
	        $element.removeClass(css.middle);
	    }

	    // #region horizontal

	    function getHorizontalPosition($contextElement, $element) {
	        elementSize = {
	            width: $element.outerWidth(),
	            height: $element.outerWidth()
	        };

	        containerSize = {
	            width: $contextElement.width(),
	            height: $contextElement.height()
	        };

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
	    }

	    function fitsToRight($contextElement) {
	        var constainerX = $contextElement.offset().left;
	        return $windowContainer.width() - constainerX - containerSize.width - margin.x - elementSize.width > 0;
	    }

	    function fitsToLeft($contextElement) {
	        var constainerX = $contextElement.offset().left;
	        return constainerX - margin.x - elementSize.width > 0;
	    }

	    function getPreferredHorizontalPosition($contextElement) {
	        var constainerX = $contextElement.offset().left;
	        return $windowContainer.width() / 2 - constainerX > 0 ? css.right : css.left;
	    }

	    // #endregion

	    // #region vertical

	    function getVerticalPosition($contextElement) {
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
	    }

	    function fitsToBottom($contextElement) {
	        var constainerY = $contextElement.offset().top;
	        return $windowContainer.height() - constainerY - containerSize.height - margin.y - elementSize.height > 0;
	    }

	    function fitsToTop($contextElement) {
	        var constainerY = $contextElement.offset().top;
	        return constainerY - margin.y - elementSize.height > 0;
	    }

	    function getPreferredVerticalPosition($contextElement) {
	        var constainerY = $contextElement.offset().top;
	        return $windowContainer.height() / 2 - constainerY > 0 ? css.bottom : css.top;
	    }

	    // #endregion

	    return {
	        cleanupPosition: cleanupPosition,
	        getHorizontalPosition: getHorizontalPosition,
	        getVerticalPosition: getVerticalPosition
	    };
	};

	module.exports = ElementPositioner;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

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

	module.exports = constants;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _localizationService = __webpack_require__(8);

	var _localizationService2 = _interopRequireDefault(_localizationService);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var htmlMarkupProvider = {
	    getHtmlMarkup: function getHtmlMarkup(html) {
	        return $.parseHTML(_localizationService2.default.localizeHtml(html));
	    }
	};

	module.exports = htmlMarkupProvider;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _langs = __webpack_require__(9);

	var _langs2 = _interopRequireDefault(_langs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var LocalizationService = function LocalizationService() {
	    var service = {
	        locale: 'en'
	    };

	    function init(locale) {
	        service.locale = locale;
	        var lang = _langs2.default[service.locale];
	        if (!lang) {
	            service.locale = 'en';
	        }
	    }

	    function localize(key) {
	        return _langs2.default[service.locale][key];
	    }

	    function localizeHtml(html) {
	        var regExp = /\{\{(.*?)\}\}/gi;
	        var result = '',
	            localizedHtml = html;
	        while ((result = regExp.exec(localizedHtml)) !== null) {
	            var match = result[0],
	                key = result[1];

	            localizedHtml = localizedHtml.replace(match, localize(key));
	        }

	        return localizedHtml;
	    }

	    return {
	        init: init,
	        localize: localize,
	        localizeHtml: localizeHtml
	    };
	};

	var localizationService = new LocalizationService();
	module.exports = localizationService;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _cn = __webpack_require__(10);

	var _cn2 = _interopRequireDefault(_cn);

	var _de = __webpack_require__(11);

	var _de2 = _interopRequireDefault(_de);

	var _en = __webpack_require__(12);

	var _en2 = _interopRequireDefault(_en);

	var _es = __webpack_require__(13);

	var _es2 = _interopRequireDefault(_es);

	var _fr = __webpack_require__(14);

	var _fr2 = _interopRequireDefault(_fr);

	var _nl = __webpack_require__(15);

	var _nl2 = _interopRequireDefault(_nl);

	var _ptBr = __webpack_require__(16);

	var _ptBr2 = _interopRequireDefault(_ptBr);

	var _ua = __webpack_require__(17);

	var _ua2 = _interopRequireDefault(_ua);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var langs = {
		cn: _cn2.default,
		de: _de2.default,
		en: _en2.default,
		es: _es2.default,
		fr: _fr2.default,
		nl: _nl2.default,
		pt_br: _ptBr2.default,
		ua: _ua2.default
	};

	module.exports = langs;

/***/ },
/* 10 */
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
		"gotIt": "Got it",
		"elementReviewHint": "Click on icon near elements to leave the comment.",
		"generalReviewHint": "Click on the panel here to leave the general comment.",
		"leaveGeneralComment": "Leave general comment",
		"typeYourCommentHere": "Type your comment here...",
		"cancel": "Cancel",
		"postComment": "Post comment"
	};

/***/ },
/* 11 */
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
		"gotIt": "Got it",
		"elementReviewHint": "Click on icon near elements to leave the comment.",
		"generalReviewHint": "Click on the panel here to leave the general comment.",
		"leaveGeneralComment": "Leave general comment",
		"typeYourCommentHere": "Type your comment here...",
		"cancel": "Cancel",
		"postComment": "Post comment"
	};

/***/ },
/* 12 */
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
		"elementReviewHint": "Click on icon near elements to leave the comment.",
		"generalReviewHint": "Click on the panel here to leave the general comment.",
		"leaveGeneralComment": "Leave general comment",
		"typeYourCommentHere": "Type your comment here...",
		"cancel": "Cancel",
		"postComment": "Post comment"
	};

/***/ },
/* 13 */
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
		"gotIt": "Got it",
		"elementReviewHint": "Click on icon near elements to leave the comment.",
		"generalReviewHint": "Click on the panel here to leave the general comment.",
		"leaveGeneralComment": "Leave general comment",
		"typeYourCommentHere": "Type your comment here...",
		"cancel": "Cancel",
		"postComment": "Post comment"
	};

/***/ },
/* 14 */
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
		"gotIt": "Got it",
		"elementReviewHint": "Click on icon near elements to leave the comment.",
		"generalReviewHint": "Click on the panel here to leave the general comment.",
		"leaveGeneralComment": "Leave general comment",
		"typeYourCommentHere": "Type your comment here...",
		"cancel": "Cancel",
		"postComment": "Post comment"
	};

/***/ },
/* 15 */
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
		"gotIt": "Got it",
		"elementReviewHint": "Click on icon near elements to leave the comment.",
		"generalReviewHint": "Click on the panel here to leave the general comment.",
		"leaveGeneralComment": "Leave general comment",
		"typeYourCommentHere": "Type your comment here...",
		"cancel": "Cancel",
		"postComment": "Post comment"
	};

/***/ },
/* 16 */
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
		"gotIt": "Got it",
		"elementReviewHint": "Click on icon near elements to leave the comment.",
		"generalReviewHint": "Click on the panel here to leave the general comment.",
		"leaveGeneralComment": "Leave general comment",
		"typeYourCommentHere": "Type your comment here...",
		"cancel": "Cancel",
		"postComment": "Post comment"
	};

/***/ },
/* 17 */
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
/* 18 */
/***/ function(module, exports) {

	module.exports = "<div class=\"review-hint\">\r\n    <div class=\"review-hint-text-wrapper\">\r\n        <div class=\"review-hint-text\"></div>\r\n    </div>\r\n    <div class=\"review-hint-action-wrapper\">\r\n        <button class=\"review-hint-btn btn\">{{gotIt}}</button>\r\n    </div>\r\n</div>\r\n";

/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";

	var clientContext = {
	    set: function set(key, value) {
	        localStorage.setItem(key, JSON.stringify(value));
	        return value;
	    },
	    get: function get(key) {
	        return JSON.parse(localStorage.getItem(key));
	    },
	    remove: function remove(key) {
	        localStorage.removeItem(key);
	    }
	};

	module.exports = clientContext;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(6);

	var _constants2 = _interopRequireDefault(_constants);

	var _SpotCollection = __webpack_require__(21);

	var _SpotCollection2 = _interopRequireDefault(_SpotCollection);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SpotController = function SpotController(hintController, dialogController) {
	    var spotCollection = new _SpotCollection2.default();

	    function hideSpots() {
	        spotCollection.hideSpots();
	    }

	    function showSpots() {
	        spotCollection.showSpots();
	    }

	    return {
	        hideSpots: hideSpots,
	        showSpots: showSpots,
	        renderSpots: renderSpots
	    };

	    function renderSpots() {
	        var ids = [];

	        $(_constants2.default.selectors.reviewable).each(function () {
	            var $element = $(this);
	            var spot = renderSpotOnElement($element);
	            if (spot) {
	                ids.push(spot.id);
	            }
	        });

	        spotCollection.filterSpots(ids);
	    }

	    function renderSpotOnElement($element) {
	        var spotId = getReviewSpotIdAttachedToElement($element);
	        if (spotId) {
	            return spotCollection.getSpotById(spotId);
	        }

	        var spot = spotCollection.addSpot($element);

	        var $spot = spot.$element.find(_constants2.default.selectors.reviewSpot);
	        $spot.click(function () {
	            onSpotClick(spot.$element);
	        });

	        $spot.data({ reviewSpotId: spot.id });
	        $element.data({ reviewSpotId: spot.id });
	        return spot;
	    }

	    function getReviewSpotIdAttachedToElement($element) {
	        var data = $element.data();
	        if (!data) return false;

	        return data.reviewSpotId;
	    }

	    function onSpotClick($spot) {
	        if (hintController.isSpotReviewHintShown()) {
	            hintController.hideSpotReviewHint();
	        } else {
	            dialogController.showElementReviewDialog($spot);
	        }
	    }
	};

	module.exports = SpotController;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(6);

	var _constants2 = _interopRequireDefault(_constants);

	var _htmlMarkupProvider = __webpack_require__(7);

	var _htmlMarkupProvider2 = _interopRequireDefault(_htmlMarkupProvider);

	var _spotPositioner = __webpack_require__(22);

	var _spotPositioner2 = _interopRequireDefault(_spotPositioner);

	var _reviewSpot = __webpack_require__(23);

	var _reviewSpot2 = _interopRequireDefault(_reviewSpot);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SpotCollection = function SpotCollection() {
	    var spotPositioner = new _spotPositioner2.default(),
	        data = {
	        arr: [],
	        maxId: 0
	    };

	    function addSpot($element) {
	        var spotMarkup = _htmlMarkupProvider2.default.getHtmlMarkup(_reviewSpot2.default);
	        var $spotWrapper = $(spotMarkup).appendTo(_constants2.default.selectors.body);
	        $spotWrapper.hide();

	        var id = data.maxId + 1;
	        var spot = {
	            id: id,
	            $element: $spotWrapper,
	            $contextElement: $element
	        };
	        data.arr.push(spot);
	        data.maxId = id;

	        spot.$contextElement.find(_constants2.default.selectors.img).one('load', updateSpotPositions);
	        spot.$contextElement.find(_constants2.default.selectors.iframe).one('load', updateSpotPositions);

	        spotPositioner.updatePosition(spot);
	        $spotWrapper.fadeIn(200);

	        return spot;
	    }

	    function updateSpotPositions() {
	        data.arr.forEach(function (item) {
	            spotPositioner.updatePosition(item);
	        });
	    }

	    function getSpotById(id) {
	        return data.arr.find(function (item) {
	            return item.id === id;
	        });
	    }

	    function filterSpots(ids) {
	        var arr = data.arr.filter(function (item) {
	            return ids.some(function (id) {
	                return item.id === id;
	            });
	        });

	        data.arr.forEach(function (item) {
	            if (arr.indexOf(item) === -1) {
	                item.$element.fadeOut(200, function () {
	                    item.$element.detach();
	                });
	            }
	        });

	        data.arr = arr;
	    }

	    function hideSpots() {
	        data.arr.forEach(function (spot) {
	            spot.$element.hide();
	        });
	    }

	    function showSpots() {
	        data.arr.forEach(function (spot) {
	            spotPositioner.updatePosition(spot);
	        });

	        data.arr.forEach(function (spot) {
	            spot.$element.show();
	        });
	    }

	    return {
	        arr: data.arr,
	        addSpot: addSpot,
	        getSpotById: getSpotById,
	        filterSpots: filterSpots,
	        hideSpots: hideSpots,
	        showSpots: showSpots
	    };
	};

	module.exports = SpotCollection;

/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";

	var SpotPositioner = function SpotPositioner() {
	    var margin = {
	        x: 3,
	        y: 10
	    },
	        size = {
	        width: 32,
	        height: 32
	    },
	        $windowContainer = $(window);

	    function updatePosition(spot) {
	        var position = getContextElementTopRightPosition(spot.$contextElement);

	        position.x = fitsInOuterCornerHirizonatlly(position) ? position.x + margin.x : position.x - size.width;
	        position.y = fitsInOuterCornerVertically(position) ? position.y + margin.y - size.width : position.y + margin.y;

	        var styles = {
	            left: position.x,
	            top: position.y
	        };

	        spot.$element.css(styles);
	    }

	    function getContextElementTopRightPosition($contextElement) {
	        var offset = $contextElement.offset();
	        return {
	            y: offset.top,
	            x: offset.left + $contextElement.outerWidth()
	        };
	    }

	    function fitsInOuterCornerHirizonatlly(position) {
	        var windowWidth = $windowContainer.width();
	        return windowWidth - position.x - size.width - margin.x > 0;
	    }

	    function fitsInOuterCornerVertically(position) {
	        return position.y + margin.y - size.width > 0;
	    }

	    return {
	        updatePosition: updatePosition
	    };
	};

	module.exports = SpotPositioner;

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = "<div class=\"review-spot-wrapper\">\r\n    <div class=\"review-spot\"></div>\r\n</div>";

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(6);

	var _constants2 = _interopRequireDefault(_constants);

	var _elementReviewDialog = __webpack_require__(25);

	var _elementReviewDialog2 = _interopRequireDefault(_elementReviewDialog);

	var _generalReviewDialog = __webpack_require__(32);

	var _generalReviewDialog2 = _interopRequireDefault(_generalReviewDialog);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ReviewDialogController = function ReviewDialogController(reviewService, hintController) {
	    var elementReviewDialog = new _elementReviewDialog2.default(reviewService),
	        generalReviewDialog = new _generalReviewDialog2.default(reviewService, onGeneralReviewDialogExpansionChanged);

	    function onGeneralReviewDialogExpansionChanged() {
	        if (hintController.isGeneralReviewHintShown()) {
	            hintController.hideGeneralReviewHint();
	        }

	        if (elementReviewDialog.isShown) {
	            elementReviewDialog.hide();
	        }
	    }

	    function showGeneralReviewDialog() {
	        generalReviewDialog.show();
	    }

	    function showElementReviewDialog($spot) {
	        if (generalReviewDialog.isExpanded) {
	            generalReviewDialog.toggleExpansion();
	        }

	        if (elementReviewDialog.isShown) {
	            var isShownForElement = elementReviewDialog.isShownForElement($spot);
	            elementReviewDialog.hide();
	            if (isShownForElement) {
	                return;
	            }
	        }

	        elementReviewDialog.show($spot, _constants2.default.css.elementReviewDialog);
	    }

	    function updatePositionIfNeeded() {
	        if (elementReviewDialog.isShown) {
	            elementReviewDialog.updatePosition();
	        }
	    }

	    return {
	        showGeneralReviewDialog: showGeneralReviewDialog,
	        showElementReviewDialog: showElementReviewDialog,
	        updatePositionIfNeeded: updatePositionIfNeeded
	    };
	};

	module.exports = ReviewDialogController;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(6);

	var _constants2 = _interopRequireDefault(_constants);

	var _commentForm = __webpack_require__(26);

	var _commentForm2 = _interopRequireDefault(_commentForm);

	var _htmlMarkupProvider = __webpack_require__(7);

	var _htmlMarkupProvider2 = _interopRequireDefault(_htmlMarkupProvider);

	var _controls = __webpack_require__(28);

	var _controls2 = _interopRequireDefault(_controls);

	var _popupPositioner = __webpack_require__(30);

	var _popupPositioner2 = _interopRequireDefault(_popupPositioner);

	var _elementReviewDialog = __webpack_require__(31);

	var _elementReviewDialog2 = _interopRequireDefault(_elementReviewDialog);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ElementReviewDialog = function ElementReviewDialog(reviewService) {
	    var commentForm = new _commentForm2.default(reviewService, hide),
	        popupPositioner = new _popupPositioner2.default(),
	        $dialog = $(_htmlMarkupProvider2.default.getHtmlMarkup(_elementReviewDialog2.default)),
	        closeBtn = new _controls2.default.Button($dialog, _constants2.default.selectors.closeDialogBtn),
	        dialog = {
	        isShown: false,
	        show: show,
	        hide: hide,
	        isShownForElement: isShownForElement,
	        updatePosition: updatePosition,
	        $parent: null
	    };

	    closeBtn.click(hide);
	    $dialog.find(_constants2.default.selectors.addCommentForm).replaceWith(commentForm.$element);

	    return dialog;

	    function show($parent) {
	        dialog.$parent = $parent;
	        $dialog.finish().css({ opacity: 0 }).removeClass(_constants2.default.css.shown).show().appendTo($parent);
	        updatePosition();

	        commentForm.init();
	        $dialog.fadeTo(50, 1, function () {
	            $dialog.addClass(_constants2.default.css.shown);
	        });

	        dialog.isShown = true;
	    }

	    function hide() {
	        $dialog.finish().fadeOut(50, function () {
	            $dialog.removeClass(_constants2.default.css.shown);
	            $dialog.detach();
	        });

	        dialog.isShown = false;
	        dialog.$parent = null;
	    }

	    function updatePosition() {
	        if (dialog.$parent) {
	            popupPositioner.setPopupPosition(dialog.$parent, $dialog);
	        }
	    }

	    function isShownForElement($spot) {
	        return $spot.find(_constants2.default.selectors.reviewDialog).length > 0;
	    }
	};

	module.exports = ElementReviewDialog;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(6);

	var _constants2 = _interopRequireDefault(_constants);

	var _clientContext = __webpack_require__(19);

	var _clientContext2 = _interopRequireDefault(_clientContext);

	var _htmlMarkupProvider = __webpack_require__(7);

	var _htmlMarkupProvider2 = _interopRequireDefault(_htmlMarkupProvider);

	var _CommentFormControls = __webpack_require__(27);

	var _CommentFormControls2 = _interopRequireDefault(_CommentFormControls);

	var _commentForm = __webpack_require__(29);

	var _commentForm2 = _interopRequireDefault(_commentForm);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var CommentForm = function CommentForm(reviewService, closeHandler) {
	    var $commentForm = $(_htmlMarkupProvider2.default.getHtmlMarkup(_commentForm2.default)),
	        controls = new _CommentFormControls2.default($commentForm);

	    subscribeOnEvents();

	    return {
	        $element: $commentForm,
	        init: init
	    };

	    function hide() {
	        if (closeHandler) {
	            closeHandler();
	        }
	    }

	    function submit() {
	        if (!controls.identifyForm.isShown) {
	            if (controls.messageForm.messageField.getValue().trim().length === 0) {
	                controls.messageForm.messageField.setErrorMark();
	                return;
	            }
	        } else {
	            if (!validateIdentifyUserForm()) return;

	            _clientContext2.default.set(_constants2.default.clientContextKeys.userName, controls.identifyForm.nameField.getValue().trim());
	            _clientContext2.default.set(_constants2.default.clientContextKeys.userMail, controls.identifyForm.mailField.getValue().trim());
	        }

	        var username = _clientContext2.default.get(_constants2.default.clientContextKeys.userName),
	            usermail = _clientContext2.default.get(_constants2.default.clientContextKeys.userMail);

	        if (!username || !username.trim() || !usermail || !usermail.trim()) {
	            switchToIdentifyUserForm();
	            return;
	        }

	        var message = controls.messageForm.messageField.getValue().trim();
	        controls.submitBtn.disable();
	        reviewService.postComment(message, username, usermail).done(function (response) {
	            switchToMessageForm();
	            controls.submitBtn.enable();
	            if (response) {
	                if (response.success) {
	                    clear();
	                    controls.commentStatusMessage.success.fadeIn();
	                } else {
	                    controls.commentStatusMessage.fail.fadeIn();
	                }
	            }
	        }).fail(function () {
	            controls.submitBtn.enable();
	            switchToMessageForm();
	            controls.commentStatusMessage.fail.fadeIn();
	        });
	    }

	    function init() {
	        clear();
	        controls.messageForm.messageField.focus();
	    }

	    function clear() {
	        controls.commentStatusMessage.hide();
	        switchToMessageForm();

	        controls.messageForm.messageField.clear();
	    }

	    function subscribeOnEvents() {
	        controls.cancelBtn.click(hide);
	        controls.submitBtn.click(submit);
	        controls.messageForm.messageField.onfocus(function () {
	            controls.commentStatusMessage.fadeOut();
	        });
	    }

	    function switchToIdentifyUserForm() {
	        controls.identifyForm.nameField.clear();
	        controls.identifyForm.mailField.clear();

	        controls.messageForm.hide();
	        controls.identifyForm.fadeIn();
	    }

	    function switchToMessageForm() {
	        controls.identifyForm.hide();
	        controls.messageForm.fadeIn();
	    }

	    function validateIdentifyUserForm() {
	        var isValid = true;
	        if (!isIdentifyFormNameValid()) {
	            controls.identifyForm.nameField.setErrorMark();
	            isValid = false;
	        }

	        if (!isIdentifyFormMailValid()) {
	            controls.identifyForm.mailField.setErrorMark();
	            isValid = false;
	        }

	        return isValid;
	    }

	    function isIdentifyFormNameValid() {
	        var value = controls.identifyForm.nameField.getValue();
	        return value && value.trim() && value.trim().length <= 254;
	    }

	    function isIdentifyFormMailValid() {
	        var value = controls.identifyForm.mailField.getValue();
	        return value && value.trim() && value.trim().length <= 254 && _constants2.default.patterns.email.test(value.trim());
	    }
	};

	module.exports = CommentForm;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(6);

	var _constants2 = _interopRequireDefault(_constants);

	var _controls = __webpack_require__(28);

	var _controls2 = _interopRequireDefault(_controls);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var CommentFormControls = function CommentFormControls($dialog) {
	    var formControls = {
	        cancelBtn: new Button(_constants2.default.selectors.cancelBtn),
	        submitBtn: new Button(_constants2.default.selectors.commentBtn),

	        commentStatusMessage: new CommentStatusMessage(),

	        messageForm: new MessageForm(),
	        identifyForm: new IdentifyForm()
	    };

	    return formControls;

	    function CommentStatusMessage() {
	        var control = Control.call(this, _constants2.default.selectors.commentStatusMessage);

	        control.success = new Message(_constants2.default.selectors.commentStatusMessage + _constants2.default.selectors.success);
	        control.fail = new Message(_constants2.default.selectors.commentStatusMessage + _constants2.default.selectors.fail);

	        return control;
	    }

	    function MessageForm() {
	        var control = Control.call(this, _constants2.default.selectors.messageWrapper);

	        control.messageField = new TextField(_constants2.default.selectors.message);

	        return control;
	    }

	    function IdentifyForm() {
	        var control = Control.call(this, _constants2.default.selectors.identifyUserWrapper);

	        control.nameField = new TextField(_constants2.default.selectors.nameInput);
	        control.mailField = new TextField(_constants2.default.selectors.mailInput);
	        control.nameErrorMessage = new Message(_constants2.default.selectors.errorMessage + _constants2.default.selectors.name);
	        control.mailErrorMassage = new Message(_constants2.default.selectors.errorMessage + _constants2.default.selectors.email);

	        return control;
	    }

	    function Message(selector) {
	        return new _controls2.default.Message($dialog, selector);
	    }

	    function Button(selector) {
	        return new _controls2.default.Button($dialog, selector);
	    }

	    function TextField(selector) {
	        return new _controls2.default.TextField($dialog, selector);
	    }

	    function Control(selector) {
	        return new _controls2.default.Control($dialog, selector);
	    }
	};

	module.exports = CommentFormControls;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(6);

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
	            handler();
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

	module.exports = controls;

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = "<form class=\"add-comment-form\">\r\n    <div class=\"message-wrapper\">\r\n        <div class=\"add-comment-form-title\">{{leaveYourComment}}</div>\r\n        <textarea class=\"comment-text-block message\" placeholder=\"{{typeYourCommentHere}}\"></textarea>\r\n    </div>\r\n    <div class=\"identify-user-wrapper\">\r\n        <div class=\"identify-user-title\">{{identifyMessage}}</div>\r\n        <div class=\"identify-user-row\">\r\n            <input class=\"name-input\" type=\"text\" />\r\n            <label>{{name}}</label>\r\n            <span class=\"error-message name\">{{enterYourNameError}}</span>\r\n        </div>\r\n        <div class=\"identify-user-row\">\r\n            <input class=\"email-input\" type=\"email\" />\r\n            <label>{{email}}</label>\r\n            <span class=\"error-message email\">{{enterValidEmailError}}</span>\r\n        </div>\r\n    </div>\r\n    <div class=\"comment-action-wrapper\">\r\n        <div class=\"comment-status-message success\" title=\"{{commentWasSent}}\">{{commentWasSent}}</div>\r\n        <div class=\"comment-status-message fail\" title=\"{{commentWasNotSent}}\">{{commentWasNotSent}}<br />{{tryAgain}}</div>\r\n        <div class=\"comment-actions\">\r\n            <button title=\"{{cancel}}\" class=\"cancel-btn\">{{cancel}}</button>\r\n            <button title=\"{{postComment}}\" class=\"comment-btn\">{{postComment}}</button>\r\n        </div>\r\n    </div>\r\n</form>";

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(6);

	var _constants2 = _interopRequireDefault(_constants);

	var _elementPositioner = __webpack_require__(5);

	var _elementPositioner2 = _interopRequireDefault(_elementPositioner);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var PopupPositioner = function PopupPositioner() {
	    var css = _constants2.default.css,
	        margin = {
	        x: 0,
	        y: 0
	    },
	        positioner = new _elementPositioner2.default(margin);

	    function setPopupPosition($container, $popup) {
	        positioner.cleanupPosition($popup);

	        var horizontalPosition = positioner.getHorizontalPosition($container, $popup);
	        $popup.addClass(horizontalPosition ? horizontalPosition : css.middle);

	        var verticalPosition = positioner.getVerticalPosition($container, $popup);
	        $popup.addClass(verticalPosition ? verticalPosition : css.bottom);
	    }

	    return {
	        setPopupPosition: setPopupPosition
	    };
	};

	module.exports = PopupPositioner;

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = "<div class=\"review-dialog element-review-dialog\">\r\n    <button class=\"close-dialog-btn\"></button>\r\n    <form class=\"add-comment-form\">\r\n    </form>\r\n</div>";

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(6);

	var _constants2 = _interopRequireDefault(_constants);

	var _commentForm = __webpack_require__(26);

	var _commentForm2 = _interopRequireDefault(_commentForm);

	var _htmlMarkupProvider = __webpack_require__(7);

	var _htmlMarkupProvider2 = _interopRequireDefault(_htmlMarkupProvider);

	var _controls = __webpack_require__(28);

	var _controls2 = _interopRequireDefault(_controls);

	var _generalReviewDialog = __webpack_require__(33);

	var _generalReviewDialog2 = _interopRequireDefault(_generalReviewDialog);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var GeneralReviewDialog = function GeneralReviewDialog(reviewService, onExpansionChanhed) {
	    var commentForm = new _commentForm2.default(reviewService),
	        $dialog = $(_htmlMarkupProvider2.default.getHtmlMarkup(_generalReviewDialog2.default)),
	        expandCollapseBtn = new _controls2.default.Button($dialog, _constants2.default.selectors.commentsHeader),
	        dialog = {
	        show: show,
	        isExpanded: false,
	        toggleExpansion: toggleExpansion
	    };

	    $dialog.find(_constants2.default.selectors.addCommentForm).replaceWith(commentForm.$element);
	    expandCollapseBtn.click(toggleExpansion);

	    return dialog;

	    function show() {
	        $dialog.appendTo(_constants2.default.selectors.body);
	        commentForm.init();
	    }

	    function toggleExpansion() {
	        var isExpanded = $dialog.hasClass(_constants2.default.css.expanded);
	        $dialog.toggleClass(_constants2.default.css.expanded);
	        dialog.isExpanded = false;

	        if (!isExpanded) {
	            commentForm.init();
	            dialog.isExpanded = true;
	        }

	        onExpansionChanhed();
	    }
	};

	module.exports = GeneralReviewDialog;

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = "<div class=\"review-dialog general-review-dialog\">\r\n    <div class=\"comments-header\">\r\n        <div class=\"comment-header-text\">{{leaveGeneralComment}}</div>\r\n        <div class=\"comments-expander\"></div>\r\n    </div>\r\n    <form class=\"add-comment-form\">\r\n    </form>\r\n</div>";

/***/ },
/* 34 */
/***/ function(module, exports) {

	"use strict";

	var WindowResizeTracker = function WindowResizeTracker() {
	    function trackWindowResize(resizeStartedHandler, resizeFinishedHandler) {
	        var rtime;
	        var timeout = false;
	        var delta = 200;
	        $(window).resize(function () {
	            resizeStartedHandler();
	            rtime = new Date();
	            if (timeout === false) {
	                timeout = true;
	                setTimeout(resizeend, delta);
	            }
	        });

	        function resizeend() {
	            if (new Date() - rtime < delta) {
	                setTimeout(resizeend, delta);
	            } else {
	                timeout = false;
	                resizeFinishedHandler();
	            }
	        }
	    }

	    return {
	        trackWindowResize: trackWindowResize
	    };
	};

	module.exports = WindowResizeTracker;

/***/ },
/* 35 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
]);