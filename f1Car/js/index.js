$(function () {
    var $gameContainer = $('#game-container');
    var $line = $('.line', $gameContainer);
    $gameContainer.aCars = []; //定义所有的其他汽车
    var oMe = new MyCar(); //定义一个我的车
    var oOthers; //定义对向的车
    //让赛道的线动起来
    $gameContainer.get(0).lineTimer = setInterval(function () {
        $line.css({
            top: '+=4'
        });
        if ($line.get(0).offsetTop >= -10) {
            $line.css('top', -400);
        }
    }, 50);
    newCar(); //先生成一个对向的车
    // 通过定时器，每隔5秒生成一个对向的车
    $gameContainer.get(0).newCarTimer = setInterval(function () {
        newCar();
    }, 5000);
    /**
     * 生成对象的车，并加入到用来装对向车的aCars数组中
     * 
     */
    function newCar() {
        oOthers = new Car();
        oOthers.move(oMe);
        $gameContainer.aCars.push(oOthers);
    }


    document.onkeyup = function (e) {
        switch (e.keyCode) {
            case 37: //left
                if ($(oMe.carBody).offset().left - 200 <= $gameContainer.offset().left) {
                    null;
                } else {
                    $(oMe.carBody).animate({
                        left: '-=200'
                    }, 500, function () {
                        if (oMe.collision($gameContainer.aCars)) {
                            //如果自己与对向的车碰撞，则游戏结束
                            gameOver(oMe);
                        }
                    });
                }
                break;
            case 38: //up
                if ($(oMe.carBody).offset().top - 100 <= $gameContainer.offset().top) {
                    null;
                } else {
                    $(oMe.carBody).animate({
                        top: '-=100'
                    }, 500, function () {
                        if (oMe.collision($gameContainer.aCars)) {
                            //如果自己与对向的车碰撞，则游戏结束
                            gameOver(oMe);
                        }
                    });
                }
                break;
            case 39: //right
                var iMeRight = $(oMe.carBody).offset().left + oMe.carBody.offsetWidth;
                var iContainerRight = $gameContainer.offset().left + $gameContainer.width();
                if (iMeRight + 200 >= iContainerRight) {
                    null;
                } else {
                    $(oMe.carBody).animate({
                        left: '+=200'
                    }, 500, function () {
                        if (oMe.collision($gameContainer.aCars)) {
                            //如果自己与对向的车碰撞，则游戏结束
                            gameOver(oMe);
                        }
                    });
                }
                break;
            case 40: //down
                var iMeBottom = $(oMe.carBody).offset().top + oMe.carBody.offsetHeight;
                var iContainerBottom = $gameContainer.offset().top + $gameContainer.height();
                if (iMeBottom + 100 >= iContainerBottom) {
                    null;
                } else {
                    $(oMe.carBody).animate({
                        top: '+=100'
                    }, 500, function () {
                        if (oMe.collision($gameContainer.aCars)) {
                            //如果自己与对向的车碰撞，则游戏结束
                            gameOver(oMe);
                        }
                    });
                }
                break;
        }
    };
});