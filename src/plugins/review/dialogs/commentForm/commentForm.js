import constants from './../../infrastructure/constants';
import clientContext from './../../infrastructure/clientContext';
import htmlMarkupProvider from './../../infrastructure/htmlMarkupProvider';
import CommentFormControls from './CommentFormControls';
import commentFormHtml from './commentForm.html';
import reviewService from './../../reviewService';

export default class CommentForm{
    constructor(closeHandler){
        this.$element = $(htmlMarkupProvider.getHtmlMarkup(commentFormHtml));
        this.controls = new CommentFormControls(this.$element);

        this.controls.cancelBtn.click(() => {
            if (closeHandler) {
                closeHandler();
            }
        });
        this.controls.submitBtn.click(() =>{
            this.submit();
        });
        this.controls.messageForm.messageField.onfocus(() => {
            this.controls.commentStatusMessage.fadeOut();
        });
    }

    submit() {
        if (!this.controls.identifyForm.isShown) {
            if (this.controls.messageForm.messageField.getValue().trim().length === 0) {
                this.controls.messageForm.messageField.setErrorMark();
                return;
            }
        }
        else {
            if (!this.validateIdentifyUserForm())
                return;

            clientContext.set(constants.clientContextKeys.userName, this.controls.identifyForm.nameField.getValue().trim());
            clientContext.set(constants.clientContextKeys.userMail, this.controls.identifyForm.mailField.getValue().trim());
        }

        var username = clientContext.get(constants.clientContextKeys.userName),
            usermail = clientContext.get(constants.clientContextKeys.userMail);

        if (!username || !username.trim() || !usermail || !usermail.trim()) {
            this.switchToIdentifyUserForm();
            return;
        }

        var message = this.controls.messageForm.messageField.getValue().trim();
        this.controls.submitBtn.disable();
        var that=this;
        reviewService.postComment(message, username, usermail)
            .done(function (response) {
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

    init() {
        this.clear();
        this.controls.messageForm.messageField.focus();
    }

    clear() {
        this.controls.commentStatusMessage.hide();
        this.switchToMessageForm();

        this.controls.messageForm.messageField.clear();
    }
        
    switchToIdentifyUserForm() {
        this.controls.identifyForm.nameField.clear();
        this.controls.identifyForm.mailField.clear();

        this.controls.messageForm.hide();
        this.controls.identifyForm.fadeIn();
    }

    switchToMessageForm() {
        this.controls.identifyForm.hide();
        this.controls.messageForm.fadeIn();
    }

    validateIdentifyUserForm() {
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

    isIdentifyFormNameValid() {
        var value = this.controls.identifyForm.nameField.getValue();
        return value && value.trim() && value.trim().length <= 254;
    }

    isIdentifyFormMailValid() {
        var value = this.controls.identifyForm.mailField.getValue();
        return value && value.trim() && value.trim().length <= 254 && constants.patterns.email.test(value.trim());
    }
};