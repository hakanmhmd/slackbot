var rssReader = require('feed-read');

module.exports = function(){
	return new Feed()
}

function Feed(){
	var self = this;

	self.getArticles = function(url, callback){
		rssReader(url, function(err, articles) {
	    if (err) {
	      return callback(err)
	    } else {
	      if (articles.length > 0) {
	      	return callback(null, articles)
	      } else {
	        return callback(new Error('Could not find any news.'))
	      }
	    }
	})
	}
}