/**
 * 定义遮罩层的类
 * 
 */
function Layout(settings) {
    this.defaultSettings = {
        content: '',
        score: 0
    };
    $.extend(this.defaultSettings, settings); //将用户设置覆盖到默认设置中
    this.$mask = $('<div id="mask"></div>');
    this.$content = $('<div class="mask-content">' + this.defaultSettings.content + '</div>');
    this.$score = $('<div class="mask-score"></div>');
    this.$restart = $('<button class="restart">重新开始</button>');
}
Layout.prototype.show = function () {
    this.$score.text('得分：' + this.defaultSettings.score);
    this.$mask.appendTo(document.body).append(this.$content)
        .append(this.$score).append(this.$restart); //添加html结构
    this.$restart.on('click', function () {
        window.location.reload();
    });
}