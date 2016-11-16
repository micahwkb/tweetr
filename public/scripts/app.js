'use strict';

const renderTweets = (tweets) => {
  const tweets_html = tweets.map((tweet) => {
    return createTweetElement(tweet);
  });
  return tweets_html;
};

const escape = (str) => {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = (tweet) => {
  const name = escape(tweet.user.name);
  const avatar = escape(tweet.user.avatars.regular);
  const handle = escape(tweet.user.handle);
  const content = escape(tweet.content.text);
  const datestamp = escape(tweet.created_at);

  return `<article>
            <header>
              <img src="${avatar}">
              <h2>${name}</h2>
              <h5>${handle}</h5>
            </header>
            <p>${content}</p>
            <footer>
              <span>${datestamp}</span>
              <i class="fa fa-heart fa-lg"></i>
              <i class="fa fa-retweet fa-lg"></i>
              <i class="fa fa-flag fa-lg"></i>
            </footer>
          </article>`;
};

const submitTweet = (tweet) => {

  $.ajax('/tweets', {
    method: 'POST',
    data: tweet
  }).done((tweet) => {
    loadTweets();
  });

};

const loadTweets = () => {

  $.getJSON('/tweets', function(dbData) {
      $('#tweets-container').html(renderTweets(dbData));
  });

};

$(document).ready(() => {

  // loadTweets();

  $('.new-tweet form').on('submit', (event) => {
    event.preventDefault();
    submitTweet($('.new-tweet form').serialize());
  });

});