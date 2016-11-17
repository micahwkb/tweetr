$(document).on('ready', () => {

  var $textarea = $('.new-tweet textarea');
  var $counter = $('span.counter');

  // adjust character counter with input
  $textarea.on('keyup', function(event) {
    var tweetLength = $(this).val().length;
    $counter.text(140 - tweetLength);
    // colorize when tweetLength exceeds char. limit
    $counter.toggleClass('warning-text', (tweetLength > 140));
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