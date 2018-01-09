/**
 * Created by gongting on 2017/12/29.
 */
$(function () {
    var $container = $('#container');
    var $info = $('#info');
    var $score = $('.score span', $info); //当前得分
    var $best = $('.best span', $info); //最好得分
    var $newGame = $('.new-game', $info); //开始新游戏
    var iNewNumber = 1; //每次生成的方块的数量
    var $aTr = $('tr', $container);
    var aTd = []; //记录td的数组
    $aTr.each(function (index, elem) {
        aTd.push($(elem).children('td')); //每个元素是一个jq对象，里面是每行的td
    });
    var $aDiv;

    new2048();
    $(document).on('keyup', function (e) {
        e = e || window.event;
        //如果按的是上下左右
        if (e.keyCode <= 40 && e.keyCode >= 37) {
            //清除所有div的show类名
            $aDiv = $('div', $container).removeClass('show');
            var aMerge = []; //需要合并元素的数组
            $aDiv.bNew2048 = true; //是否需要生成新的2048方块
            switch (e.keyCode) {
                case 37: //left
                    for (var i = 0; i < aTd.length; i++) {
                        aMerge = [];
                        aTd[i].each(function () {
                            if (this.innerHTML != '') {
                                aMerge.push($(this).children('div'));
                            }
                        });

                        if (aMerge.length > 1) {
                            mergeDivTransverse(aMerge, 0, 1, 0, 2, 'left');
                        } else if (aMerge.length = 1) {
                            $(aMerge[0]).animate({
                                left: 5
                            }, 100, function () {
                                changeDiv($(this), null, 0);
                            });
                        }
                    }
                    break;
                case 38: //up
                    var $td; // 记录当前查看的td
                    for (var i = 0; i < aTd[0].length; i++) {
                        aMerge = [];
                        for (var j = 0; j < aTd.length; j++) {
                            $td = aTd[j].eq(i);
                            if ($td.text() != '') {
                                aMerge.push($td.children('div'));
                            }
                        }

                        if (aMerge.length > 1) {
                            mergeDivLongitudinal(aMerge, 0, 1, 0, 2, 'left');
                        } else if (aMerge.length = 1) {
                            $(aMerge[0]).animate({
                                top: 5
                            }, 100, function () {
                                changeDiv($(this), 0, null);
                            });
                        }
                    }
                    break;
                case 39: //right
                    for (var i = 0; i < aTd.length; i++) {
                        aMerge = []; //需要合并元素的数组
                        aTd[i].each(function () {
                            if (this.innerHTML != '') {
                                aMerge.push($(this).children('div'));
                            }
                        });

                        if (aMerge.length > 1) {
                            mergeDivTransverse(aMerge, aMerge.length - 2, aMerge.length - 1, aTd[0].length - 1, 2, 'right');
                        } else if (aMerge.length = 1) {
                            $(aMerge[0]).animate({
                                left: 160 * (aTd[0].length - 1) + 5
                            }, 100, function () {
                                changeDiv($(this), null, aTd[0].length - 1);
                            });
                        }
                    }
                    break;
                case 40: //down
                    var $td; // 记录当前查看的td
                    for (var i = 0; i < aTd[0].length; i++) {
                        aMerge = [];
                        for (var j = 0; j < aTd.length; j++) {
                            $td = aTd[j].eq(i);
                            if ($td.text() != '') {
                                aMerge.push($td.children('div'));
                            }
                        }

                        if (aMerge.length > 1) {
                            mergeDivLongitudinal(aMerge, aMerge.length - 2, aMerge.length - 1, aTd.length - 1, 2, 'right');
                        } else if (aMerge.length = 1) {
                            $(aMerge[0]).animate({
                                top: 160 * (aTd.length - 1) + 5
                            }, 100, function () {
                                changeDiv($(this), aTd.length - 1, null);
                            });
                        }
                    }
                    break;
            }
            $container.newDivTimer = setInterval(function () {
                //当没有div做动画的时候在生成新的2048方块
                if ($aDiv.filter(':animated').length == 0) {
                    if ($score.html() == '2048') { //若分数达到2048
                        new Layout({
                            content: 'You Win!',
                            score: $score.html(),
                            type: 'win'
                        });
                    } else {
                        new2048(iNewNumber);
                    }
                    clearInterval($container.newDivTimer);
                }
            }, 100);
        }
    });

    //点击开始新游戏
    $newGame.on('click', function () {
        //清空所有的td
        for (var i = 0; i < aTd.length; i++) {
            aTd[i].each(function () {
                $(this).empty();
            });
        }
        //清空当前成绩
        $score.text(0);
        //重新生成2048方块
        new2048();
    });

    /**
     * 获取min-max之间的随机整数
     * 
     * @param {number} min 最小边界
     * @param {number} max 最大边界
     * @returns number
     */
    function getRandom(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    /**
     * 生成2048方块
     * 
     * @param {number} num 生成的数量1/2,可以不传，不传则会随机生成1/2个
     */
    function new2048(num) {
        // 获取当前td为空的
        var $aEmptyTd = $('td:empty', $container);
        var aNewPos = []; //生成方块的位置数组
        var iNewNum = 0; //生成方块的数量
        typeof num == 'number' ? iNewNum = num : iNewNum = getRandom(1, 2);

        // 判断生成1个还是2个方块
        switch (iNewNum) {
            case 1:
                aNewPos[0] = getRandom(0, $aEmptyTd.length - 1); //生成方块的位置
                break;
            case 2:
                do {
                    aNewPos[0] = getRandom(0, $aEmptyTd.length - 1); //生成方块1的位置
                    aNewPos[1] = getRandom(0, $aEmptyTd.length - 1); //生成方块2的位置
                } while (aNewPos[1] === aNewPos[0]); //当两次随机数相同的时候重复执行
                break;
        }
        // 因为可能生成一个，可能生成两个方块，所以循环
        for (var i = 0; i < aNewPos.length; i++) {
            var $div;
            // 若随机数是1则生成一个2,否则生成一个4
            if (getRandom(1, 2) === 1) {
                $div = $('<div class="diamand-2 show">2</div>');
            } else {
                $div = $('<div class="diamand-4 show">4</div>');
            }
            $div.css({
                left: $aEmptyTd.eq(aNewPos[i]).position().left + 5,
                top: $aEmptyTd.eq(aNewPos[i]).position().top + 5
            });
            $aEmptyTd.eq(aNewPos[i]).append($div);
        }
    }

    /**
     * 用来切换elem的位置，切换到iTr行iTd列的td中
     * 
     * @param {object} elem 要切换的div元素
     * @param {number} iTr 要切换的行数，传null默认elem当前所在行
     * @param {number} iTd 要切换的列数，传null默认elem当前所在列
     */
    function changeDiv(elem, iTr, iTd) {
        var iNowTr = elem.closest('tr').index();
        var iNowTd = elem.closest('td').index();
        if (iTr == null) {
            iTr = iNowTr;
        }
        if (iTd == null) {
            iTd = iNowTd;
        }
        aTd[iTr].eq(iTd).html(elem);
    }

    /**
     * 修改成绩和最好成绩
     * 
     * @param {string} score 要修改为的成绩
     */
    function changeScore(score) {
        $score.text($score.text() * 1 + score * 1); //设置当前得分为score
        if ($score.text() * 1 > $best.text() * 1) { //若当前得分>最好成绩
            $best.text($score.text()); //设置最好成绩为score
        }
    }

    /**
     * 合并横向的div元素，所以行数不用变，只需传入列数
     * 
     * @param {array} arr 要合并的元素数组
     * @param {number} num1 要合并的下标1
     * @param {number} num2 要合并的下标2
     * @param {number} iTd 合并到的列数
     * @param {number} iNowLength 现在已知的arr的长度
     * @param {string} sDirection 合并方向：left（向左合并）/right（向右合并）
     */
    function mergeDivTransverse(arr, num1, num2, iTd, iNowLength, sDirection) {
        if (arr[num1].text() == arr[num2].text()) {
            arr[num1].animate({
                left: 160 * iTd + 5
            }, 100, function () {
                changeDiv($(this), null, iTd);
                this.innerHTML *= 2;
                this.className = 'diamand-' + this.innerHTML;
                changeScore(this.innerHTML); //修改成绩
            });
            arr[num2].animate({
                left: 160 * iTd + 5
            }, 100, function () {
                $(this).closest('td').text('');
            });
            //第一次进入：num1,num2已经合并，此时判断长度是否为3
            if (arr.length == iNowLength + 1) {
                if (sDirection == 'left') {
                    arr[num2 + 1].animate({
                        left: 160 * (iTd + 1) + 5
                    }, 100, function () {
                        changeDiv($(this), null, iTd + 1);
                    });
                } else {
                    arr[num1 - 1].animate({
                        left: 160 * (iTd - 1) + 5
                    }, 100, function () {
                        changeDiv($(this), null, iTd - 1);
                    });
                }
            } else if (arr.length > iNowLength + 1) {
                //第一次进入：说明长度为4
                if (sDirection == 'left') {
                    arguments.callee(arr, num1 + 2, num2 + 2, iTd + 1, iNowLength + 2, 'left');
                } else {
                    arguments.callee(arr, num1 - 2, num2 - 2, iTd - 1, iNowLength + 2, 'right');
                }
            }
        } else {
            arr[sDirection == 'left' ? num1 : num2].animate({
                left: 160 * iTd + 5
            }, 100, function () {
                changeDiv($(this), null, iTd);
            });
            //第一次进入：num2=1，此时判断长度是否为3
            if (arr.length >= iNowLength + 1) {
                if (sDirection == 'left') {
                    arguments.callee(arr, num1 + 1, num2 + 1, iTd + 1, iNowLength + 1, 'left');
                } else {
                    arguments.callee(arr, num1 - 1, num2 - 1, iTd - 1, iNowLength + 1, 'right');
                }
            } else {
                //第一次进入：说明只有两个
                if (sDirection == 'left') {
                    arr[num2].animate({
                        left: 160 * (iTd + 1) + 5
                    }, 100, function () {
                        changeDiv($(this), null, iTd + 1);
                    });
                } else {
                    arr[num1].animate({
                        left: 160 * (iTd - 1) + 5
                    }, 100, function () {
                        changeDiv($(this), null, iTd - 1);
                    });
                }
            }
        }
    }

    /**
     * 合并纵向的div元素，所以列数不用变，只需传入行数
     * 
     * @param {array} arr 要合并的元素数组
     * @param {number} num1 要合并的下标1
     * @param {number} num2 要合并的下标2
     * @param {number} iTd 合并到的行数
     * @param {number} iNowLength 现在已知的arr的长度
     * @param {string} sDirection 合并方向：left（向上合并）/right（向下合并）
     */
    function mergeDivLongitudinal(arr, num1, num2, iTd, iNowLength, sDirection) {
        if (arr[num1].text() == arr[num2].text()) {
            arr[num1].animate({
                top: 160 * iTd + 5
            }, 100, function () {
                changeDiv($(this), iTd, null);
                this.innerHTML *= 2;
                this.className = 'diamand-' + this.innerHTML;
                changeScore(this.innerHTML); //修改成绩                
            });
            arr[num2].animate({
                top: 160 * iTd + 5
            }, 100, function () {
                $(this).closest('td').text('');
            });
            //第一次进入：num1,num2已经合并，此时判断长度是否为3
            if (arr.length == iNowLength + 1) {
                if (sDirection == 'left') {
                    arr[num2 + 1].animate({
                        top: 160 * (iTd + 1) + 5
                    }, 100, function () {
                        changeDiv($(this), iTd + 1, null);
                    });
                } else {
                    arr[num1 - 1].animate({
                        top: 160 * (iTd - 1) + 5
                    }, 100, function () {
                        changeDiv($(this), iTd - 1, null);
                    });
                }
            } else if (arr.length > iNowLength + 1) {
                //第一次进入：说明长度为4
                if (sDirection == 'left') {
                    arguments.callee(arr, num1 + 2, num2 + 2, iTd + 1, iNowLength + 2, 'left');
                } else {
                    arguments.callee(arr, num1 - 2, num2 - 2, iTd - 1, iNowLength + 2, 'right');
                }
            }
        } else {
            arr[sDirection == 'left' ? num1 : num2].animate({
                top: 160 * iTd + 5
            }, 100, function () {
                changeDiv($(this), iTd, null);
            });
            //第一次进入：num2=1，此时判断长度是否为3
            if (arr.length >= iNowLength + 1) {
                if (sDirection == 'left') {
                    arguments.callee(arr, num1 + 1, num2 + 1, iTd + 1, iNowLength + 1, 'left');
                } else {
                    arguments.callee(arr, num1 - 1, num2 - 1, iTd - 1, iNowLength + 1, 'right');
                }
            } else {
                //第一次进入：说明只有两个
                if (sDirection == 'left') {
                    arr[num2].animate({
                        top: 160 * (iTd + 1) + 5
                    }, 100, function () {
                        changeDiv($(this), iTd + 1, null);
                    });
                } else {
                    arr[num1].animate({
                        top: 160 * (iTd - 1) + 5
                    }, 100, function () {
                        changeDiv($(this), iTd - 1, null);
                    });
                }
            }
        }
    }
});