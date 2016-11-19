"use strict";

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
      const objectId = `ObjectId("${id}")`;
      // const object = tweets.find({"_id" :objectId}).toArray(callback)

      tweets.updateOne({ "_id" : objectId },{ $set : { "new_field" : count } },
        function(err, result) { callback(err, result) })
    }

  };
  db.close();
}