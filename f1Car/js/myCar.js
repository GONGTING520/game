var $sum = $('#score span');//获取总分
function MyCar() {
    this.carBody = $('<div class="my-car"><img src="img/F1.png"/></div>').css({
        left: 285,
        bottom: 10
    }).get(0);
    $(this.carBody).appendTo($track.eq(1));
}
/**
 * 判断自己是否与arr中的车碰撞
 * 
 * @param {array} arr 要判断的车辆数组
 * @returns true表示有碰撞，false表示无碰撞
 */
MyCar.prototype.collision = function (arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].bLife) { //如果车还在
            // 若对向车与自己有覆盖
            if (cover(arr[i].carBody, this.carBody)) {
                return true;
            }
        } else {          
            arr.splice(i, 1); //删除此对象
        }
    }
    return false;
};