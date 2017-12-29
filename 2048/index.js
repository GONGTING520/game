/**
 * Created by gongting on 2017/12/29.
 */
$(function () {
    var $container = $('#container');
    new2048();
    $(document).on('keyup', function (e) {
        switch (e.keyCode) {
            case 37: //left
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
                aNewPos[0] = getRandom(0, $aEmptyTd.length); //生成方块的位置
                break;
            case 2:
                do {
                    aNewPos[0] = getRandom(0, $aEmptyTd.length); //生成方块1的位置
                    aNewPos[1] = getRandom(0, $aEmptyTd.length); //生成方块2的位置
                } while (aNewPos[1] === aNewPos[0]); //当两次随机数相同的时候重复执行
                break;
        }
        // 因为可能生成一个，可能生成两个方块，所以循环
        for (var i = 0; i < aNewPos.length; i++) {
            // 若随机数是1则生成一个2,否则生成一个4
            if (getRandom(1, 2) === 1) {
                $aEmptyTd.eq(aNewPos[i]).append('<div class="one">2</div>');
            } else {
                $aEmptyTd.eq(aNewPos[i]).append('<div class="two">4</div>');
            }
        }
    }
});