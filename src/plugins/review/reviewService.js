class ReviewService {
    init(reviewApiUrl, courseId, authoringToolDomain){
        this.reviewApiUrl=reviewApiUrl;
        this.courseId=courseId;
        this.authoringToolDomain=authoringToolDomain;
    }

    postComment(message, username, useremail, context) {
        const data = JSON.stringify({
          courseId: this.courseId,
          text: message.trim(),
          createdByName: username.trim(),
          createdBy: useremail.trim(),
          context
        });

        return $.ajax({
            url: this.getApiUrl('comments'),
            data,
            type: 'POST',
            headers: {
              'Content-Type': 'application/json',
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
