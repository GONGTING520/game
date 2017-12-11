$(function () {
    var $gameContainer = $('#game-container');
    var $line = $('.line', $gameContainer);
    $gameContainer.iTimerSpeed = 3000;
    $gameContainer.bLevel2 = false;
    $gameContainer.bLevel3 = false;
    $gameContainer.bLevel4 = false;
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
    // 通过定时器，每隔$gameContainer.iTimerSpeed秒生成一个对向的车
    $gameContainer.get(0).newCarTimer = setInterval(function () {
        newCar();
    }, $gameContainer.iTimerSpeed);
    /**
     * 生成对象的车，并加入到用来装对向车的aCars数组中
     * 
     */
    function newCar() {
        oOthers = new Car();
        if (parseInt($sum.html()) < 60) {
            null;
        } else if (parseInt($sum.html()) < 300) {
            oOthers.iSpeed *= 1.5;
            if (!$gameContainer.bLevel2) {
                $($gameContainer.aCars).each(function () {
                    this.iSpeed = oOthers.iSpeed;
                });
                clearInterval($gameContainer.get(0).newCarTimer);
                $gameContainer.get(0).newCarTimer = setInterval(function () {
                    newCar();
                }, $gameContainer.iTimerSpeed / 3);
                $gameContainer.bLevel2 = !$gameContainer.bLevel2;
            }
        } else if (parseInt($sum.html()) < 600) {
            oOthers.iSpeed *= 2;
            if (!$gameContainer.bLevel3) {
                $($gameContainer.aCars).each(function () {
                    this.iSpeed = oOthers.iSpeed;
                });
                clearInterval($gameContainer.get(0).newCarTimer);
                $gameContainer.get(0).newCarTimer = setInterval(function () {
                    newCar();
                }, $gameContainer.iTimerSpeed / 5);
                $gameContainer.bLevel3 = !$gameContainer.bLevel3;
            }
        } else {
            oOthers.iSpeed *= 3;
            if (!$gameContainer.bLevel4) {
                $($gameContainer.aCars).each(function () {
                    this.iSpeed = oOthers.iSpeed;
                });
                clearInterval($gameContainer.get(0).newCarTimer);
                $gameContainer.get(0).newCarTimer = setInterval(function () {
                    newCar();
                }, $gameContainer.iTimerSpeed / 6);
                $gameContainer.bLevel4 = !$gameContainer.bLevel4;
            }
        }
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
                            gameOver(oMe.carBody);
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
                            gameOver(oMe.carBody);
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
                            gameOver(oMe.carBody);
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
                            gameOver(oMe.carBody);
                        }
                    });
                }
                break;
        }
    };
});