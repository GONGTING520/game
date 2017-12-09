var $gameContainer = $('#game-container');
var $track = $('.track', $gameContainer);
var oLose = new Layout({
    content: 'YOU LOSE!'
}); //定义游戏结束的遮罩层
$gameContainer.aCars = []; //定义所有的其他汽车
/**
 * 定义对向的车类
 * 
 */
function Car() {
    this.sPosition = getPosition();
    this.iSpeed = 2; //移动速度
    this.bLife = true;
    this.new();
    $gameContainer.aCars.push(this);
}
/**
 * 创建一个对向的车
 * 
 */
Car.prototype.new = function () {
    this.carBody = $('<div class="enemy-car"><img src="img/F2.png"/></div>').css('top', -80).get(0);
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
 * @param {object} elem 用户控制的车辆
 */
Car.prototype.move = function (elem) {
    this.timer = setInterval(function () {
        this.carBody.style.top = this.carBody.offsetTop + this.iSpeed + 'px';
        if (this.carBody.offsetTop >= $gameContainer.offset().top + $gameContainer.height()) {
            clearInterval(this.timer); //清楚自己的定时器
            this.bLife = false;
            $(this.carBody).remove(); //移除自己
            $sum.text(parseInt($sum.text()) + 20); //增加总分          
        }
        if (this.collision(elem)) {
            //如果自己与用户控制的车碰撞，则游戏结束
            gameOver(elem);
            oLose.show();
        }
    }.bind(this), 50);
};
/**
 * 让车停止
 * 
 */
Car.prototype.stopCar = function () {
    clearInterval(this.timer);
};
/**
 * 判断自己是否与用户控制的车碰撞
 * 
 * @param {object} elem 要判断用户控制的车辆
 * @returns true表示有碰撞，false表示无碰撞
 */
Car.prototype.collision = function (elem) {
    if (cover(this.carBody, elem.carBody)) {
        return true;
    }
    return false;
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
/**
 * 判断自己是否与用户控制的车辆有覆盖部分
 * 
 * @param {object} target 自己
 * @param {object} elem 用户控制的车
 * @returns true表示有覆盖，false表示无覆盖
 */
function cover(target, elem) {
    var $targetPos = $(target).offset();
    var $elemPos = $(elem).offset();
    if (Math.abs($targetPos.left - $elemPos.left) <= $(elem).width()) {
        if (Math.abs($targetPos.top - $elemPos.top) <= $(elem).height()) {
            return true;
        }
    }
    return false;
}
/**
 * 游戏结束，让所有定时器停止，包括赛道线，生成新的对向车，每辆车的定时器
 * 并让用户的车停止所有动画
 * 
 * @param {object} elem 用户控制的车
 */
function gameOver(elem) {
    clearInterval($gameContainer.get(0).newCarTimer);
    clearInterval($gameContainer.get(0).lineTimer);
    $($gameContainer.aCars).each(function () {
        this.stopCar();
    });
    $(elem).stop(true, true); //清空动画队列，动画立即完成
    document.onkeyup = null;
}