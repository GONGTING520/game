function Layout(settings) {
    var defaultSetting = {
        content: '',
        score: 0,
        type: 'win' //  win/lose
    };
    $.extend(defaultSetting, settings); //合并设置
    var $layout = $('<div id="' + defaultSetting.type + '"></div>');
    var $layoutName = $('<div class="title">' + defaultSetting.content + '</div>'); //遮罩层的标题
    var $layoutScore = $('<div class="score">成绩：' + defaultSetting.score + '</div>'); //显示的成绩
    var $select = $('<div class="select clearfix"></div>');
    if (defaultSetting.type == 'win') {
        var $continu = $('<div class="continu">继续游戏</div>').appendTo($select);
    }
    var $new = $('<div class="new">重新开始</div>').appendTo($select); //重新开始
    $layout.append($layoutName).append($layoutScore).append($select).appendTo('#container');
}