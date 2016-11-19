"use strict";

module.exports = function makeDataHelpers(db) {
  return {
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet);
      callback(null, true);
    },

    getTweets: function(callback) {
      const sortNewestFirst = (a, b) => a.created_at - b.created_at;
      db.collection("tweets").find().toArray(callback);
    },
    addLike: function(callback) {
      db.collection("tweets").updateOne(
        { "_id": ObjectId("582f533a4a04102238bdfb70") },
        { "likes": "1" });
    }

  };
  db.close();
}