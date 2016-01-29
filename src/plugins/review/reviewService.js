class ReviewService {
    init(reviewApiUrl, courseId){
        this.reviewApiUrl=reviewApiUrl;
        this.courseId=courseId;
    }
    
    postComment(message, username, useremail) {
        return $.ajax({
            url: this.getApiUrl('api/comment/create'),
            data: { courseId: this.courseId, text: message.trim(), createdByName: username.trim(), createdBy: useremail.trim() },
            type: 'POST'
        });
    }
    
    getApiUrl(apiPath) {
        if (this.reviewApiUrl.indexOf('/', this.reviewApiUrl.length - 1) !== -1) {
            return this.reviewApiUrl + apiPath;
        }

        return this.reviewApiUrl + '/' + apiPath;
    }
}

var reviewService = new ReviewService();
export default reviewService;