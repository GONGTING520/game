/**
 * Created by gongting on 2017/12/29.
 */
$(function () {
    var $container = $('#container');
    var iNewNumber = 1; //每次生成的方块的数量
    var $aTd = [];
    var $aTr = $('tr', $container);
    $aTr.each(function (index, elem) {
        $aTd.push($(elem).children('td')); //每个元素是一个jq对象，里面是每行的td
    });
    var $aDiv;

    new2048();
    $(document).on('keyup', function (e) {
        $aDiv = $('div', $container).removeClass('show');
        switch (e.keyCode) {
            case 37: //left
                $aDiv.animate({
                    left: 5
                }, 100);
                changeDiv($aDiv.eq(0), null, 0);
                break;
            case 38: //up
                break;
            case 39: //right
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
                $div = $('<div class="one show">2</div>');
            } else {
                $div = $('<div class="two show">4</div>');
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
        $aTd[iTr].eq(iTd).html(elem);
    }
});