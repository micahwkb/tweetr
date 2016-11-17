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

$(document).ready(() => {

  loadTweets();

  // clear any warnings for tweet form
  $('.new-tweet textarea').on('focus', (event) => {
    $('section.new-tweet h4').remove();
  });

  // watch for tweet submission
  $('.new-tweet form').on('submit', (event) => {

    const text = $('textarea').val();
    submitTweet(text);
    event.preventDefault();
  });
  // watch for Compose button click
  $('.compose-button').on('click', (event) => {
    $('section.new-tweet').toggleClass('hidden');
  });

});