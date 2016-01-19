import constants from './../../infrastructure/constants';
import controls from './../controls/controls';
    
var CommentFormControls = function ($dialog) {
    var formControls = {
        cancelBtn: Button(constants.selectors.cancelBtn),
        submitBtn: Button(constants.selectors.commentBtn),

        commentStatusMessage: CommentStatusMessage(),

        messageForm: MessageForm(),
        identifyForm: IdentifyForm()
    };

    return formControls;

    function CommentStatusMessage() {
        var control = Control.call(this, constants.selectors.commentStatusMessage);

        control.success = Message(constants.selectors.commentStatusMessage + constants.selectors.success);
        control.fail = Message(constants.selectors.commentStatusMessage + constants.selectors.fail);

        return control;
    }

    function MessageForm() {
        var control = Control.call(this, constants.selectors.messageWrapper);

        control.messageField = TextField(constants.selectors.message);

        return control;
    }

    function IdentifyForm() {
        var control = Control.call(this, constants.selectors.identifyUserWrapper);

        control.nameField = TextField(constants.selectors.nameInput);
        control.mailField = TextField(constants.selectors.mailInput);
        control.nameErrorMessage = Message(constants.selectors.errorMessage + constants.selectors.name);
        control.mailErrorMassage = Message(constants.selectors.errorMessage + constants.selectors.email);

        return control;
    }

    function Message(selector) {
        return controls.Message($dialog, selector);
    }

    function Button(selector) {
        return controls.Button($dialog, selector);
    }

    function TextField(selector) {
        return controls.TextField($dialog, selector);
    }

    function Control(selector) {
        return controls.Control($dialog, selector);
    }
};
    
export default CommentFormControls;
