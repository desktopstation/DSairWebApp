//
// 以下の内容をもとに作成
// https://qiita.com/negi3d/items/4d4531af66774f503659

var Toast = function () {
    this.timer = null;
};

Toast.prototype.defaultTimeout_ms = 3000;

Toast.prototype.show = function(message, timeout_ms) {
    if (timeout_ms === undefined) {
        timeout_ms = this.defaultTimeout_ms;
    }
    $('.toast').remove();
    clearTimeout(this.timer);
    $('body').append('<div class="toast">' + message + '</div>');
    var leftpos = $('body').width()/2 - $('.toast').outerWidth()/2;
    $('.toast').css('left', leftpos).hide().fadeIn('fast');
    
    this.timer = setTimeout(function() {
        $('.toast').fadeOut('slow',function(){
            $(this).remove();
        });
    }, timeout_ms);
};

Toast.prototype.hide = function() {
    $('.toast').fadeOut('slow',function() {
        $(this).remove();
    });
};
