'use strict';

const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "<script>alert('I feel safe')</script>"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];

const renderTweets = (tweets) => {
  const $el = $('#tweets-container');
  $el.append("");
  const tweets_html = tweets.map((tweet) => {
    return createTweetElement(tweet);
  });
  $el.append(tweets_html)
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

function submitTweet(tweetData) {

  $.ajax('/tweets', {
    method: 'POST',
    data: tweetData
  }).done((tweetData) => {
    renderTweets();
  });

};

$(document).ready(() => {

  renderTweets(data);

  $('.new-tweet form').on('submit', (event) => {
    event.preventDefault();
    submitTweet($('.new-tweet form').serialize());
  });

});