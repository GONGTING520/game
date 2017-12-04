var iNow = 1;//记录当前的图片号
var oGameUl = document.getElementById('game');
var aGameImg = oGameUl.getElementsByTagName('img');
var aGameLi = oGameUl.getElementsByTagName('li');//获取装图片的li
var aIndex = [0 ,1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ];//表示图片的位置
var aIndex2 = [0 ,1 ,2 ,3 ,4 ,5 ,6 ,7 ,8];//表示切换的li的顺序
var oBtn = document.getElementById('btn');//获取装按钮的div
//获取显示答案和下一题的按钮
var oShowAnswerBtn = oBtn.getElementsByTagName('button')[0];
var oNextBtn = oBtn.getElementsByTagName('button')[1];
//获取答案的div和img
var oAnswerDiv = document.getElementById('answer');
var oAnswerImg = oAnswerDiv.getElementsByTagName('img')[0];
var iChange = 0;//用来记录当前切换的小图片块
var oGameTitleH3 = document.getElementById('game-title');//获取游戏标题
var oTime = document.getElementById('time');

oTime.timer = null;//加一个剩余时间的定时器
oTime.oDate = new Date();
oTime.oDate.setMinutes(1);//设定剩余时间
oTime.oDate.setSeconds(0);
oTime.innerHTML = oTime.oDate.getMinutes() + ':' + oTime.oDate.getSeconds();//显示剩余时间
oGameUl.bFlag = false;//定义标识位，来记录图片是否拼好

//        将索引数组乱序
aIndex.sort(function (a, b) {
    return Math.random() - 0.5;
});
//        通过索引数组给图片定位并给li定位
for(var i = 0 ; i < aGameImg.length ; i++){
    aGameImg[i].style.left = -aGameLi[i].offsetWidth * (aIndex[i] % 3) + 'px';
    aGameImg[i].style.top = -aGameLi[i].offsetHeight * parseInt(aIndex[i] / 3) + 'px';
    aGameLi[i].style.left = aGameLi[i].offsetLeft + 'px';
    aGameLi[i].style.top = aGameLi[i].offsetTop + 'px';
}
//        给装图片的li绑定拖拽事件
for(var j = 0 ; j < aGameLi.length ; j++){
    aGameLi[j].aCollide = [];//定义数组用来装与元素碰撞的元素
    aGameLi[j].oNearest = null;//定义对象用来记录与元素最近的元素
    aGameLi[j].style.position = 'absolute';
//            给每一个li加一个用来记录初始位置的对象pos
    aGameLi[j].pos = {
        left: aGameLi[j].offsetLeft,
        top: aGameLi[j].offsetTop
    };
    aGameLi[j].index = j;
    drag(aGameLi[j]);
}

setRestTime();
/**
 * 封装一个计时函数
 * 用来设定剩余时间
 * */
function setRestTime() {
    oTime.timer = setInterval(function () {
        var iMinute = oTime.oDate.getMinutes();
        var iSecond = oTime.oDate.getSeconds();
        iSecond--;
        if(iSecond < 0){
            iSecond = 59;
            iMinute--;
            oTime.oDate.setMinutes(iMinute);
        }
        oTime.oDate.setSeconds(iSecond);
        oTime.innerHTML = oTime.oDate.getMinutes() + ':' + oTime.oDate.getSeconds();
        if(oTime.oDate.getMinutes() == 0 && oTime.oDate.getSeconds() == 0){
            clearInterval(oTime.timer);
            alert('很遗憾你没有完成关卡');
        }
    },1000);
}
/**
 * 封装拖拽函数
 * 传进一个元素表示要拖拽的对象
 * */
function drag(elem){
//            鼠标点击的时候记住鼠标与li的相对位置
    elem.onmousedown = function (e) {
        e = e || window.event;
        elem.style.zIndex = 2;
//                获取初始鼠标相对ul的位置
        var iMouseLeft = e.clientX - oGameUl.offsetLeft - elem.offsetLeft;
        var iMouseTop = e.clientY - oGameUl.offsetTop - elem.offsetTop;

        document.onmousemove = function(e){
            e = e || window.event;
//                    移动后鼠标相对ul的位置
            var iLeft = e.clientX - iMouseLeft - oGameUl.offsetLeft;
            var iTop = e.clientY - iMouseTop - oGameUl.offsetTop;
            elem.style.left = iLeft + 'px';
            elem.style.top = iTop + 'px';
            elem.oNearest = null;
            elem.aCollide = [];//将碰撞检测的数组置空
            collide(elem);//碰撞检测
//                    当至少有一个碰撞元素时，才去寻找距离最近的元素
            if(elem.aCollide.length > 0){
                getNearest(elem);
            }
            return false;//阻止默认行为
        };
        document.onmouseup = function(){
            elem.style.zIndex = 1;
            document.onmousemove = null;
//                    如果有oNearest，则交换位置
            if(elem.oNearest){
                var oTempPos = elem.oNearest.pos;
                elem.oNearest.pos = elem.pos;
                elem.pos = oTempPos;
                elem.oNearest.style.left = elem.oNearest.pos.left + 'px';
                elem.oNearest.style.top = elem.oNearest.pos.top + 'px';
            }
            elem.style.left = elem.pos.left + 'px';
            elem.style.top = elem.pos.top + 'px';
            document.onmouseup = null;
        };
    };
}
/**
 * 封装碰撞检测函数
 * 传进一个元素表示要检测此对象与其他对象是否碰撞
 * 将与其碰撞的元素加到数组
 * */
function collide(elem) {
    var iElemLeft = elem.offsetLeft;
    var iElemTop = elem.offsetTop;
    var iTargetLeft , iTargetTop;
    for(var i = 0 ; i < aGameLi.length ; i++){
        if(i == elem.index){
            continue;
        }
        iTargetLeft = aGameLi[i].offsetLeft;
        iTargetTop = aGameLi[i].offsetTop;
        if(Math.abs(iTargetTop - iElemTop) < elem.offsetHeight && Math.abs(iTargetLeft - iElemLeft) < elem.offsetWidth){
            elem.aCollide.push(aGameLi[i]);
        }
    }
}

/**
 * 封装寻找最近元素函数
 * 传进一个元素表示寻找此元素最近的元素
 * 返回最近的元素
 * */
function getNearest(elem) {
    var iNearestDis = getDistance(elem , elem.aCollide[0]);
    elem.oNearest = elem.aCollide[0];
    for(var i = 1 ; i < elem.aCollide.length ; i++){
//                如果距离小于设定的最小距离，则将最小距离改为此距离,并将有最小距离的元素更改
        if(getDistance(elem, elem.aCollide[i]) < iNearestDis){
            iNearestDis = getDistance(elem, elem.aCollide[i]);
            elem.oNearest = elem.aCollide[i];
        }
    }
}

/**
 * 封装计算两个元素距离的函数
 * 传进一个元素表示正在拖拽的对象，另外一个元素表示被碰撞的元素
 * 返回距离的平方
 * */
function getDistance(elem, target) {
    var iLeftSquare = Math.pow((elem.offsetLeft - target.offsetLeft),2);//横坐标的差的平方
    var iTopSquare = Math.pow((elem.offsetTop - target.offsetTop),2);//纵坐标的差的平方
    return iLeftSquare + iTopSquare;
}

oShowAnswerBtn.onclick = function () {
    oAnswerDiv.style.display = 'block';
};
oNextBtn.onclick = function () {
    oGameUl.bFlag = judgePuzzleImg();
    if(oGameUl.bFlag){
        clearInterval(oTime.timer);
        oTime.oDate.setMinutes(1);
        oTime.oDate.setSeconds(0);
        iNow++;
        if(iNow > 6){
            alert('恭喜狗子！你通关了！');
        }else {
            setRestTime();
            changeImg();
        }
    }else{
        alert('狗子你还未拼好，不能进行下一关卡！');
    }
};

/**
 * 封装一个切换图片的函数
 * */
function changeImg() {
    //表示图片的位置
    aIndex.sort(function (a, b) {
        return Math.random() - 0.5;
    });
    //表示切换的li的顺序
    aIndex2.sort(function (a, b) {
        return Math.random() - 0.5;
    });
    timer = setInterval(function () {
        if(iChange > aIndex.length - 1){
            iChange = 0;
            clearInterval(timer);
        }else {
            aGameImg[aIndex2[iChange]].src = 'img/puzzle' + iNow + '.jpg';
            aGameImg[aIndex2[iChange]].style.left = -aGameLi[0].offsetWidth * (aIndex[iChange] % 3) + 'px';
            aGameImg[aIndex2[iChange]].style.top = -aGameLi[0].offsetHeight * parseInt(aIndex[iChange] / 3) + 'px';
            iChange++;
        }
    },400);
    oGameTitleH3.innerHTML = '现在是第' + iNow + '关，一共6关';
    oAnswerDiv.style.display = 'none';
    oAnswerImg.src = 'img/puzzle' + iNow + '.jpg';
}

/**
 * 封装一个判断图片是否拼好的函数函数
 * 如果图片拼好，则返回true
 * 未拼好，则返回false
 * */
function judgePuzzleImg(){
    for(var i = 0 ; i < aGameLi.length ; i++){
        var iLeft = aGameLi[i].offsetWidth * (aIndex[i] % 3);
        var iTop = aGameLi[i].offsetHeight * parseInt(aIndex[i] / 3);
        if(aGameLi[aIndex2[i]].pos.left != iLeft || aGameLi[aIndex2[i]].pos.top != iTop) {
            return false;
        }
    }
    return true;
}