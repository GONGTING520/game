var $gameContainer = $('#game-container');
var $track = $('.track', $gameContainer);
/**
 * 定义对向的车类
 * 
 */
function Car() {
    this.sPosition = getPosition();
    this.iSpeed = 2; //移动速度
    this.bLife = true;
    this.new();
    this.move();
}
/**
 * 创建一个对向的车
 * 
 */
Car.prototype.new = function () {
    this.carBody = $('<div class="enemy-car"></div>').css('top', -80).get(0);
    if (this.sPosition === 'left') {
        $(this.carBody).appendTo($track.eq(0)).css('left', 85);
    } else if (this.sPosition === 'center') {
        $(this.carBody).appendTo($track.eq(1)).css('left', 285);
    } else if (this.sPosition === 'right') {
        $(this.carBody).appendTo($track.eq(2)).css('left', 485);
    }
};
/**
 * 让车一直移动，添加自己的属性timer
 * 
 */
Car.prototype.move = function () {
    this.timer = setInterval(function () {
        this.carBody.style.top = this.carBody.offsetTop + this.iSpeed + 'px';
        if (this.carBody.offsetTop >= $gameContainer.offset().top + $gameContainer.height()) {
            clearInterval(this.timer); //清楚自己的定时器
            this.bLife = false;
            $(this.carBody).remove(); //移除自己
            $sum.text(parseInt($sum.text()) + 20); //增加总分          
        }
    }.bind(this), 50);
};
/**
 * 让车停止
 * 
 */
Car.prototype.stop = function () {
    clearInterval(this.timer);
};
/**
 * 获取车的位置
 * 
 * @returns 车的位置，‘left’表示左侧，‘center’表示左侧，‘right’表示左侧
 */
function getPosition() {
    var i = Math.round(Math.random() * 2);
    switch (i) {
        case 0:
            return 'left';
        case 1:
            return 'center';
        case 2:
            return 'right';
    }
}