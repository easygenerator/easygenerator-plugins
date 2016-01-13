import constants from './../../infrastructure/constants';
import controls from './../controls/controls';
    
var CommentFormControls = function ($dialog) {
    var formControls = {
        cancelBtn: new Button(constants.selectors.cancelBtn),
        submitBtn: new Button(constants.selectors.commentBtn),

        commentStatusMessage: new CommentStatusMessage(),

        messageForm: new MessageForm(),
        identifyForm: new IdentifyForm()
    };

    return formControls;

    function CommentStatusMessage() {
        var control = Control.call(this, constants.selectors.commentStatusMessage);

        control.success = new Message(constants.selectors.commentStatusMessage + constants.selectors.success);
        control.fail = new Message(constants.selectors.commentStatusMessage + constants.selectors.fail);

        return control;
    }

    function MessageForm() {
        var control = Control.call(this, constants.selectors.messageWrapper);

        control.messageField = new TextField(constants.selectors.message);

        return control;
    }

    function IdentifyForm() {
        var control = Control.call(this, constants.selectors.identifyUserWrapper);

        control.nameField = new TextField(constants.selectors.nameInput);
        control.mailField = new TextField(constants.selectors.mailInput);
        control.nameErrorMessage = new Message(constants.selectors.errorMessage + constants.selectors.name);
        control.mailErrorMassage = new Message(constants.selectors.errorMessage + constants.selectors.email);

        return control;
    }

    function Message(selector) {
        return new controls.Message($dialog, selector);
    }

    function Button(selector) {
        return new controls.Button($dialog, selector);
    }

    function TextField(selector) {
        return new controls.TextField($dialog, selector);
    }

    function Control(selector) {
        return new controls.Control($dialog, selector);
    }
};
    
module.exports = CommentFormControls;
