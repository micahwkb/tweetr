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
  const datestamp = new Date(tweet.created_at);

  return `
    <article>
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
    </article>
  `;
};

const submitTweet = (tweet) => {
  $('h4.warning-text').empty();

  if (tweet.length > 140) {
    $('<h4/>', {
      class: 'warning-text',
      text: `Please keep it under 140 characters ↑`
    }).appendTo('.new-tweet');

  } else if (!tweet) {
    $('<h4/>', {
      class: 'warning-text',
      text: 'Your tweet is empty 😿'
    }).appendTo('.new-tweet');

  } else {
    $.post('/tweets', `text=${tweet}`, loadTweets());
    $('textarea').val('');
    $('span.counter').html('140');
    $('textarea').focus();
  }
};

const reverseSort = (data, sortProp) => {
  return data.sort((a, b) => {
    return b[sortProp] - a[sortProp];
  });
};

const loadTweets = () => {
  $.getJSON('/tweets', (dbData) => {
    const newestFirst = reverseSort(dbData, 'created_at');
    $('#tweets-container').html(renderTweets(newestFirst));
  });
};

const toggleCompose = () => {
  const $newTweet = $('section.new-tweet');
  const $composeButton = $('button.compose-btn');
  $composeButton.click(() => {
    $newTweet.slideToggle('fast');
    $('.new-tweet textarea').focus();
  })
};

const clearTweetValidationError = () => {
  $('.new-tweet textarea').on('focus', () => {
    $('section.new-tweet h4').remove();
  });
};

const tweetSubmission = () => {
  $('.new-tweet form').on('submit', () => {
    const text = $('textarea').val();
    submitTweet(text);
    event.preventDefault();
  });
};

$(document).ready(() => {

  // load existing tweets
  loadTweets();

  // initially hide compose field
  $('section.new-tweet').hide()

  // watch for Compose button click
  toggleCompose();

  // clear any warnings for tweet form
  clearTweetValidationError();

  // watch for tweet submission
  tweetSubmission();

});