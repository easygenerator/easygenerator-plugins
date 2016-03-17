export default class SpotContextValidator {
    validate(context) {
        if (!context)
            return true;
            
        switch(context.type) {
            case 'course':
                validateCourseContext();
                break;
            case 'question':
                validateQuestionContext();
                break;
            case 'informationContent':
                validateInformationContentContext();
                break;
            case 'section':
                validateSectionContext();
                break;
            default:
                trowError('Unknown review context type \'' + context.type + '\'. Possible values are: \'course\', \'question\', \'informationContent\', \'section\'.');
        }   
            
        function validateCourseContext(){            
            if (!context.property || !(context.property === 'title' || context.property === 'introduction')) {
                trowError('Unknown course review context property \'' + context.property + '\'. Possible values are: \'title\', \'introduction\'.');
            }
        }
        
        function validateQuestionContext(){
            validateContextTitle();
            validateContextId(); 
            
            if (context.property && !(context.property === 'voiceOver' || context.property === 'learningContent')) {
                trowError('Unknown question review context property \'' + context.property + '\'. Possible values are: \'voiceOver\', \'learningContent\'.');
            }                    
        }
        
        function validateInformationContentContext(){
            validateContextTitle();
            validateContextId(); 
            
            if (context.property && context.property !== 'voiceOver') {
                trowError('Unknown information content review context property \'' + context.property + '\'. Possible values are: \'voiceOver\'.');
            }                    
        }
        
        function validateSectionContext(){
            validateContextTitle();
            validateContextId();      
            
            if (context.property !== 'title') {
                trowError('Unknown section review context property \'' + context.property + '\'.');
            }            
        }
        
        function validateContextId(){
            if(!context.id){
                trowError('Review context id is not defined.');
            }
        }
        
        function validateContextTitle(){                      
            if(!context.title){
                trowError('Review context title is not defined.');
            }
            
            if(context.title.trim().length < 1 || context.title.trim().length >= 256){
                trowError('Review context title \'' + context.title + '\' is invalid.');
            }
        }

        function trowError(error) {
            throw '[Review plugin] ' + error + ' Context object: ' + JSON.stringify(context);
        }
    }
}
