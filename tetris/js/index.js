$(function () {
    var $game = $('#game');
    var $gameNext = $('.next', $game);
    var $score = $('.game-info span', $game).eq(1);
    var $gameContent = $('.game-content', $game);
    // 定义最小的top，判断是否满一行时，只需比较大于iMinTop的方块
    $gameContent.iMinTop = $gameContent.height();
    var aTetris = []; //表示已经下落停止的方块数组
    var first = newTetris();
    var now = first; //当前下落的方块
    fallDown(first);
    var oNext = newTetris(); //下一个下落的方块
    var $next = $(oNext.aDiv).clone();
    addNext($next);


    /**
     * 定义一个定时器，让now一直下落，当碰到其他方块或底部时停止
     *
     */
    function fallDown() {
        now.timer = setInterval(function () {
            //若正在下落的方块碰到其他方块或底部
            if (collision('top', now.iWidth) || now.collisionBottom()) {
                stopNow();
            } else {
                now.fallOne();
            }
        }, now.speed);
    }
    /**
     * 停止now的定时器，并将now.bMovable置为false，将now加入数组，
     * 修改总分和最小top，判断能否清除一行，再判断是否失败，
     * 若未失败，则切换下一个
     * 
     */
    function stopNow() {
        clearInterval(now.timer);
        now.bMovable = false;
        aTetris.push(now);
        //总分加5
        $score.html(parseInt($score.html()) + 5);
        //修改最小top
        for (var i = 0; i < now.aDiv.length; i++) {
            if ($gameContent.iMinTop > now.aDiv[i].offsetTop) {
                $gameContent.iMinTop = now.aDiv[i].offsetTop;
            }
        }
        //使用判断清除一行的函数
        for (var iTop = $gameContent.iMinTop; iTop < $gameContent.height(); iTop = iTop + 30) {
            judgeFullLine(iTop);
        }
        removeAtetrisElem();
        if ($gameContent.iMinTop <= 0) {
            var settings = {
                content: 'YOU LOSE!',
                score: $score.html()
            }
            var oLose = new Layout(settings); //定义遮罩层
            oLose.show();
        } else {
            toggleNowAndNext();
        }
    }
    /**
     * 拷贝传入的对象，在下一个位置上，插入这个表示下一个会出现的方块的对象
     *
     * @param {object} next 表示下一个会出现的方块
     */
    function addNext(next) {
        $('div', $gameNext).remove(); //移除原来的方块
        next.each(function (index, elem) {
            $(this).css({
                top: '+=' + $(elem).width() * 3
            });
        });
        $gameNext.append(next);
    }
    /**
     * 判断aTetris数组中的对象中的小方块是否都清除，
     * 若都清除了则清除这个对象
     * 
     */
    function removeAtetrisElem() {
        var aIndex = [];
        var bFlag = true; //true表示需要清除第i个元素，false表示不需要清除
        //因为每次删除元素，元素的位置会改变，所以要从后往前删
        for (var i = 0; i < aTetris.length; i++) {
            bFlag = true;
            for (var j = 0; j < aTetris[i].aDiv.length; j++) {
                if (typeof aTetris[i].aDiv[j] === 'object') {
                    bFlag = false;
                    break;
                }
            }
            if (bFlag) {
                aIndex.push(i);
            }
        }
        for (var i = aIndex.length - 1; i >= 0; i--) {
            aTetris.splice(aIndex[i], 1);
        }
    }
    /**
     * 判断top=iTop的方块数是否够10，够则清除这些方块，
     * 调用clearLine函数，并让所有top<iTop的方块下落一格
     * 
     * @param {number} iTop 
     */
    function judgeFullLine(iTop) {
        var aLine = []; //top为iTop的小方块的数组
        // 循环所有已下落方块的数组
        for (var i = 0; i < aTetris.length; i++) {
            // 循环每个方块中的小方块
            for (var j = 0; j < aTetris[i].aDiv.length; j++) {
                // 如果小方块的top等于iTop
                var oDiv = aTetris[i].aDiv[j];
                if (oDiv != 0) {
                    if ($(oDiv).position().top === iTop) {
                        aLine.push({
                            fatherIndex: i,
                            elem: aTetris[i].aDiv[j]
                        });
                    }
                }
            }
        }
        if (aLine.length == 10) {
            clearLine(aLine); //清除这一行
            //修改最小的top
            $gameContent.iMinTop += now.iWidth;
            //让top小于iTop的下落
            lessThanITopFallOne(iTop);
            //总分加20
            $score.html(parseInt($score.html()) + 20);
        }
    }
    /**
     * 让top<iTop的所有小方块都下落一格
     * 
     * @param {number} iTop 
     */
    function lessThanITopFallOne(iTop) {
        $(aTetris).each(function () {
            $(this.aDiv).each(function () {
                if (this.offsetTop < iTop) {
                    this.style.top = this.offsetTop + this.offsetWidth + 'px';
                }
            });
        });
    }
    /**
     * 清除arr中元素的dom结构和在数组中的结构
     * 
     * @param {array} arr 表示要清除的元素
     */
    function clearLine(arr) {
        $(arr).each(function () {
            $(this.elem).remove();
            aTetris[this.fatherIndex].aDiv.splice($(this.elem).data('index'), 1, 0);
        });
    }
    /**
     * 切换当前控制的元素和下一个方块元素
     *
     */
    function toggleNowAndNext() {
        now = oNext;
        fallDown();
        oNext = newTetris();
        $next = $(oNext.aDiv).clone();
        addNext($next);
    }
    /**
     * 判断正在下落的对象的下一个位置与已经下落完毕
     * 的对象数组aTetris中的对象是否碰撞
     *
     * @param {string} sDic 下一个位置是要修改top/left
     * @param {int} iSpeed 移动一格的长度+iSpeed/-iSpeed
     * @returns bFlag 表示是否停止，true表示停止，false表示不停止
     */
    function collision(sDic, iSpeed) {
        var aNext = []; //自己的下一个状态的位置信息数组
        $(now.aDiv).each(function () {
            var obj = $(this).position(); //获取当前位置
            obj[sDic] += iSpeed; //修改成下一个位置
            aNext.push(obj);
        });
        for (var i = 0; i < aTetris.length; i++) {
            if (now.cover(aNext, aTetris[i])) {
                //如果下一个状态与已经落下的方块碰撞
                return true;
            }
        }
        return false;
    }

    /**
     * 判断元素elem是否超出左右边界
     *
     * @param {object} elem 要判断的方块的js原生对象
     * @param {int} edgeLeft 边界的left
     * @param {string} sLOrR ‘left’或者‘right’表示左边界或右边界
     * @returns true表示碰撞，false表示没碰上
     */
    function overEdge(elem, edgeLeft, sLOrR) {
        var bFlag = false;
        if (sLOrR === 'left') {
            $(elem).each(function () {
                if ($(this).css('left').split('px')[0] <= edgeLeft) {
                    bFlag = true;
                }
            });
        } else if (sLOrR === 'right') {
            $(elem).each(function () {
                if ($(this).css('left').split('px')[0] >= edgeLeft) {
                    bFlag = true;
                }
            });
        }
        return bFlag;
    }

    /**
     * 判断变形后是否超过边界，或者碰到其他元素
     * 
     */
    function transfigurationOverEdge() {
        var iRight = $gameContent.position().left + $gameContent.width();
        // 如果变形后超过左右边界,碰到其他元素或者碰到底部
        if (overEdge(now.aDiv, $gameContent.position().left - now.iWidth, 'left') ||
            overEdge(now.aDiv, iRight, 'right') || collision('top', 0) ||
            now.collisionBottom()) {
            switch (now.transfigurationDirction) {
                case 'up':
                    now.transfigurationLeft(); //变成朝左
                    break;
                case 'down':
                    now.transfigurationRight(); //变成朝右
                    break;
                case 'left':
                    now.transfigurationDown(); //变成朝下
                    break;
                case 'right':
                    now.transfigurationUp(); //变成朝上
                    break;
            }
        }
    }

    document.onkeydown = function (e) {
        // now活着
        if (now.bMovable) {
            switch (e.keyCode) {
                case 37: //左
                    // 如果没与其他方块碰撞并且没与左边界碰撞
                    if (!collision('left', -now.iWidth) && !overEdge(now.aDiv, $gameContent.position().left, 'left')) {
                        $(now.aDiv).each(function (index, elem) {
                            $(this).css({
                                left: '-=' + $(elem).width()
                            });
                        });
                    } else {
                        $(now.aDiv).each(function () {
                            $(this).css({
                                left: '-=0'
                            });
                        });
                    }
                    break;
                case 38: //上
                    now.transfiguration();
                    transfigurationOverEdge();
                    break;
                case 39: //右
                    // 如果没与右边界碰撞
                    var iRight = $gameContent.position().left + $gameContent.width() - now.iWidth;
                    if (!collision('left', now.iWidth) && !overEdge(now.aDiv, iRight, 'right')) {
                        $(now.aDiv).each(function (index, elem) {
                            $(this).css({
                                left: '+=' + $(elem).width()
                            });
                        });
                    } else {
                        $(now.aDiv).each(function () {
                            $(this).css({
                                left: '-=0'
                            });
                        });
                    }
                    break;
                case 40: //下
                    // 如果底部与其他方块碰撞或与底部碰撞
                    if (collision('top', now.iWidth) || now.collisionBottom()) {
                        stopNow();
                    } else {
                        $(now.aDiv).each(function (index, elem) {
                            $(this).css({
                                top: '+=' + $(elem).height()
                            });
                        });
                    }
                    break;
            }
        }
    };
});