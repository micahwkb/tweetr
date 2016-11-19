"use strict";

var ObjectId = require('mongodb').ObjectId;

module.exports = function makeDataHelpers(db) {
  const tweets = db.collection("tweets");
  return {
    saveTweet: function(newTweet, callback) {
      tweets.insertOne(newTweet);
      callback(null, true);
    },

    getTweets: function(callback) {
      const sortNewestFirst = (a, b) => a.created_at - b.created_at;
      tweets.find().toArray(callback);
    },
    addLike: function(id, count, callback) {
      tweets.updateOne({ "_id" : ObjectId(id) },{ "$set" : { "new_field" : count } },
        function(err, result) {
          debugger
          callback(err, result)
        })
    }

  };
  db.close();
}