/**
 * Created by gongting on 2017/12/29.
 */
$(function () {
    var $container = $('#container');
    var iNewNumber = 1; //每次生成的方块的数量
    var aTd = [];
    var $aTr = $('tr', $container);
    $aTr.each(function (index, elem) {
        aTd.push($(elem).children('td')); //每个元素是一个jq对象，里面是每行的td
    });
    var $aDiv;

    new2048(2);
    $(document).on('keyup', function (e) {
        $aDiv = $('div', $container).removeClass('show');
        var aMerge = []; //需要合并元素的数组
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
                        mergeDiv(aMerge, 0, 1, 0, 2, 'left');
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
                        mergeDiv(aMerge, aMerge.length - 2, aMerge.length - 1, aTd[0].length - 1, 2, 'right');
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
                break;
        }
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
                    // aNewPos[0] = getRandom(0, $aEmptyTd.length - 1); //生成方块1的位置
                    // aNewPos[1] = getRandom(0, $aEmptyTd.length - 1); //生成方块2的位置
                    // aNewPos[0] = 5;
                    // aNewPos[1] = 6;
                    // aNewPos[2] = 7;
                    // aNewPos[3] = 4;
                    aNewPos[0] = 0;
                    aNewPos[1] = 4;
                    aNewPos[2] = 8;
                    aNewPos[3] = 12;
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

    function mergeDiv(arr, num1, num2, iTd, iNowLength, sDirection) {
        if (arr[num1].text() == arr[num2].text()) {
            arr[num1].animate({
                left: 160 * iTd + 5
            }, 100, function () {
                changeDiv($(this), null, iTd);
                this.innerHTML *= 2;
                this.className = 'diamand-' + this.innerHTML;
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

});