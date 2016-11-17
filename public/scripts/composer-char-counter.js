$(document).on('ready', function() {

  var $textarea = $('.new-tweet textarea');
  var $counter = $('span.counter');

  // adjust character counter with input
  $textarea.on('keyup', function(event) {
    var tweetLength = $(this).val().length;
    $counter.text(140 - tweetLength);
    // colorize when tweetLength exceeds char. limit
    if (tweetLength > 140) {
      $counter.toggleClass("warning-text");
    // return to black when tweetLength within limit
    } else {
      $counter.removeClass("warning-text");
    }
  });
  // update counter while 'Backspace' held
  $textarea.on('keydown', function(event) {
    var tweetLength = $(this).val().length;
    if (event.key === 'Backspace') {
      $counter.html(140 - tweetLength);
    }
  });

  $textarea.on('change'), function(event) {
    $counter.html(140 - tweetLength);
  }

});