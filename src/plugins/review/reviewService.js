class ReviewService {
    init(reviewApiUrl, courseId, authoringToolDomain){
        this.reviewApiUrl=reviewApiUrl;
        this.courseId=courseId;
        this.authoringToolDomain=authoringToolDomain;
    }

    postComment(message, username, useremail, context) {
        return $.ajax({
            url: this.getApiUrl('comments'),
            data: {
              courseId: this.courseId,
              text: message.trim(),
              createdByName: username.trim(),
              createdBy: useremail.trim(),
              context: context ? JSON.stringify(context) : context,
              authoringToolDomain: this.authoringToolDomain
            },
            type: 'POST',
            headers: {
              'X-Authoring-Tool-Domain': this.authoringToolDomain
            }
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
