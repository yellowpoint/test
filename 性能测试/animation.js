/**
 * Created by admin on 2016/12/9.
 */
// animation.js

// 粒子总数
var COUNT = 500;
// 重力
var G = -0.1;
// 摩擦力
var F = -0.04;
var objects = [];
function init() {
    objects.push({
        x: 250,
        y: 250,
        d: d,
        v: v
    });

    for (var i = 0; i < COUNT; i++) {
        var d = Math.random() * 2 * Math.PI;
        var v = Math.random() * 5;
        var circle = $('<div id="circle-' + i +
            '" class="circle" data-x="250" data-y="250" data-d="' + d +
            '" data-v="' + v + '"></div>');
        circle.appendTo($('.main'));
    }
}

function updateCircle() {
    for (var i = 0; i < COUNT; i++) {
        var x = parseFloat($('#circle-' + i).attr('data-x'));
        var y = parseFloat($('#circle-' + i).attr('data-y'));
        var d = parseFloat($('#circle-' + i).attr('data-d'));
        var v = parseFloat($('#circle-' + i).attr('data-v'));
        var vx = v * Math.cos(d);
        var vy = v * Math.sin(d);
        if (Math.abs(vx) < 1e-9) vx = 0;
// 速度分量改变
        vx += F * Math.cos(d);
        vy += F * Math.sin(d) + G;
// 计算新速度
        v = Math.sqrt(vx * vx + vy * vy);
        if (vy > 0) d = Math.acos(vx / v);
        else d = -Math.acos(vx / v);
// 位移分量改变
        x += vx;
        y += vy;
        $('#circle-' + i).attr('data-x', x);
        $('#circle-' + i).attr('data-y', y);
        $('#circle-' + i).attr('data-d', d);
        $('#circle-' + i).attr('data-v', v);
        $('#circle-' + i).css({'top': 400 - y, 'left': x});
    }
}

var interval = null;

function showAnimation() {
    if (interval) clearInterval(interval);
    $('.main').html('');
    init();
    interval = setInterval(updateCircle, 1000 / 60);
}