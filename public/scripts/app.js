'use strict';

const renderTweets = function(tweets) {
  const tweets_html = tweets.map(function(tweet) {
    return createTweetElement(tweet);
  });
  return tweets_html;
};

const escape = function(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const timeSince = function(timestamp) {
  const nowTime = Date.now();
  const minSince = (nowTime - timestamp) / (1000 * 60);
  let timeStr;
  if (minSince < 1) {
    timeStr = "just now";
  } else if (minSince >= 1 && minSince < 2){
    timeStr = `about a minute ago`;

  } else if (minSince >= 2 && minSince < 120) {
    timeStr = `${Number.parseInt(minSince)} minutes ago`;

  } else if (minSince >= 120 && minSince < 1440) {
    timeStr = `${Number.parseInt(minSince / 60)} hours ago`;

  } else if (minSince >= 1440 && minSince < 2880) {
    timeStr = "yesterday";

  } else {
    timeStr = `${Number.parseInt(minSince / (60 * 24))} days ago`;
  }
  return timeStr;
}

const timeConverter = function(UNIX_timestamp) {
  const a = new Date(UNIX_timestamp);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  let hour = a.getHours();
  let ampm = 'AM';
  if (hour > 12) {
    hour -= 12;
    ampm = 'PM';
  }
  let min = a.getMinutes();
  if (min < 10) min = `0${min}`

  let sec = a.getSeconds()
  if (sec < 10) sec = `0${sec}`

  const time = `${month} ${date} ${year} - ${hour}:${min}:${sec} ${ampm}`;
  return time;
};

const createTweetElement = function(tweet) {
  const name = escape(tweet.user.name);
  const likes = tweet.likes;
  const avatar = escape(tweet.user.avatars.regular);
  const handle = escape(tweet.user.handle);
  const content = escape(tweet.content.text);
  const datestamp = timeConverter(tweet.created_at);
  const databaseId = tweet._id;
  const elapsedTime = timeSince(tweet.created_at);

  return `
    <article data-tweetr-id="${databaseId}">
      <header>
        <img src="${avatar}">
        <h2>${name}</h2>
        <h5>${handle}</h5>
      </header>
      <p>${content}</p>
      <footer>
        <span>${elapsedTime}  (${datestamp})</span>
        <i class="fa fa-heart fa-lg">
          <span>${likes || ""}</span></i>
        <i class="fa fa-retweet fa-lg"></i>
        <i class="fa fa-flag fa-lg"></i>

      </footer>
    </article>
  `;
};

const submitTweet = function(tweet) {
  $('h4.warning-text').empty();

  if (tweet.trim().length > 140) {
    $('<h4/>', {
      class: 'warning-text',
      text: `Please keep it under 140 characters ↑`
    }).appendTo('.new-tweet');

  } else if (!tweet || tweet.trim().length === 0) {
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

const reverseSort = function(data, sortProp) {
  return data.sort(function(a, b) {
    return b[sortProp] - a[sortProp];
  });
};

const loadTweets = function() {
  $.getJSON('/tweets', function(dbData) {
    const sortedDb = reverseSort(dbData, 'created_at');
    $('#tweets-container').html(renderTweets(sortedDb));
  });
};

const toggleCompose = function() {
  const $newTweet = $('section.new-tweet');
  const $composeButton = $('button.compose-btn');
  $composeButton.click(function() {
    $newTweet.slideToggle('fast');
    $('.new-tweet textarea').focus();
  })
};

const clearTweetValidationError = function() {
  $('.new-tweet textarea').on('focus', function() {
    $('section.new-tweet h4').remove();
  });
};

const tweetSubmission = function() {
  $('.new-tweet form').on('submit', function() {
    const text = $('textarea').val();
    submitTweet(text);
    event.preventDefault();
  });
};

const toggleLike = function(event) {
  const $heart = $('i.fa-heart');
  let likeCount;
  $('#tweets-container').on('click', '.fa-heart', function() {
    $(this).toggleClass('liked');
    const $articleId = $(this).closest('article').data('tweetr-id');
    if ($(this).hasClass('liked')) {
      likeCount = 1;
      console.log("liked!");
    } else {
      likeCount = -1;
      console.log("unliked!");
    }
  });
  $.post('/likes', likeCount, loadTweets());
};

$(document).ready(function() {

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

  // watch for likes
  toggleLike();
});