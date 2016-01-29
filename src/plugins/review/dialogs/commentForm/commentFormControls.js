import constants from './../../infrastructure/constants';
import Control from './../controls/control';
import Message from './../controls/message';
import Button from './../controls/button';
import TextField from './../controls/textField';
    
export default class CommentFormControls{
    constructor($dialog) {
        this.cancelBtn= new Button($dialog, constants.selectors.cancelBtn);
        this.submitBtn = new Button($dialog, constants.selectors.commentBtn);

        this.commentStatusMessage = createCommentStatusMessage($dialog);
        this.messageForm = createMessageForm($dialog);
        this.identifyForm = createIdentifyForm($dialog);
    }
};

function createCommentStatusMessage($dialog) {
    var control = new Control($dialog, constants.selectors.commentStatusMessage);

    control.success = new Message($dialog, constants.selectors.commentStatusMessage + constants.selectors.success);
    control.fail = new Message($dialog, constants.selectors.commentStatusMessage + constants.selectors.fail);

    return control;
}

function createMessageForm($dialog) {
    var control = new Control($dialog, constants.selectors.messageWrapper);

    control.messageField = new TextField($dialog, constants.selectors.message);

    return control;
}

function createIdentifyForm($dialog) {
    var control = new Control($dialog, constants.selectors.identifyUserWrapper);

    control.nameField = new TextField($dialog, constants.selectors.nameInput);
    control.mailField = new TextField($dialog, constants.selectors.mailInput);
    control.nameErrorMessage = new Message($dialog, constants.selectors.errorMessage + constants.selectors.name);
    control.mailErrorMassage = new Message($dialog, constants.selectors.errorMessage + constants.selectors.email);

    return control;
}