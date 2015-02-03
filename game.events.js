game.events = {
    deviceready: function () {},
    offline: function () {},

    mouseUp: function () {
        game.cfg.mouseIsDown = 0;
        game.cfg.bar.fill.toggle = game.cfg.bar.fill.off;
        game.cfg.bar.stroke.toggle = game.cfg.bar.stroke.off;
        game.cfg.dragging = false;
        game.events.mouseXY();
    },

    touchUp: function (e) {
        if (!e) {
	        e = event;
        }
        game.cfg.len = e.targetTouches.length;
        game.cfg.bar.fill.toggle = game.cfg.bar.fill.off;
        game.cfg.bar.stroke.toggle = game.cfg.bar.stroke.off;
    },

    mouseDown: function (e) {
        game.cfg.mouseIsDown = 1;
        if (e.offsetX > game.cfg.bar.x && e.offsetX < game.cfg.bar.x + game.cfg.bar.w && e.offsetY > game.cfg.bar.y && e.offsetY < game.cfg.bar.y + game.cfg.bar.h) {
	        game.cfg.bar.fill.toggle = game.cfg.bar.fill.on;
            game.cfg.bar.stroke.toggle = game.cfg.bar.stroke.on;
	        game.cfg.dragging = true;
        }
        game.events.mouseXY();
    },

    touchDown: function (e) {
        var x, y;
        game.cfg.mouseIsDown = 1;
        game.cfg.len = e.targetTouches.length;
        for (i = 0; i < game.cfg.len; i++) {
	        x = e.targetTouches[i].pageX - game.can.offsetLeft;
	        y = e.targetTouches[i].pageY - game.can.offsetTop;

	        if (x > game.cfg.bar.x && x < game.cfg.bar.x + game.cfg.bar.w && y > game.cfg.bar.y && y < game.cfg.bar.y + game.cfg.bar.h) {
		        game.cfg.bar.fill.toggle = game.cfg.bar.fill.on;
                game.cfg.bar.stroke.toggle = game.cfg.bar.stroke.on;
		        game.cfg.dragging = true;
	        }
        }
        game.events.touchXY();
    },

    mouseXY: function (e) {
        if (!e) {
	        e = event;
        }
        if (game.cfg.dragging) {
	        game.cfg.canX[0] = e.pageX - game.can.offsetLeft;
	        game.cfg.canY[0] = e.pageY - game.can.offsetTop;
	        game.cfg.len = 1;

	        //if (game.cfg.bar.x < 0) {
		        //game.cfg.bar.x = 0;
	        //} else if (game.cfg.bar.x + game.cfg.bar.w > game.can.width) {
		        //game.cfg.bar.x = game.can.width - game.cfg.bar.w;
	        //} else {
		        game.cfg.bar.x = e.offsetX - game.cfg.bar.w / 2;
	        //}
        }
    },

    touchXY: function (e) {
        if (!e) {
	        e = event;
        }
        e.preventDefault();
        game.cfg.len = e.targetTouches.length;
        for (i = 0; i < game.cfg.len; i++) {
           if (game.cfg.dragging) {
		        game.cfg.canX[i] = e.targetTouches[i].pageX - game.can.offsetLeft;
		        game.cfg.canY[i] = e.targetTouches[i].pageY - game.can.offsetTop;

		        //if (game.cfg.bar.x < 0) {
			        //game.cfg.bar.x = 0;
		        //} else if (game.cfg.bar.x + game.cfg.bar.w > game.can.width) {
			        //game.cfg.bar.x = game.can.width - game.cfg.bar.w;
		        //} else {
			        game.cfg.bar.x = game.cfg.canX[i] - game.cfg.bar.w / 2;
		        //}
	        }
        }
    }
};

document.addEventListener("deviceready", game.events.deviceready, false);
document.addEventListener('offline', game.events.offline, false);

game.can.addEventListener('mousedown', game.events.mouseDown, false);
game.can.addEventListener('mousemove', game.events.mouseXY, false);
game.can.addEventListener('touchstart', game.events.touchDown, false);
game.can.addEventListener('touchend', game.events.touchUp, false);
game.can.addEventListener('touchmove', game.events.touchXY, false);

document.body.addEventListener('mouseup', game.events.mouseUp, false);
document.body.addEventListener('touchcancel', game.events.touchUp, false);

if (!navigator.onLine) {
  game.events.offline();
}

game.util.sound('intro');

$('button').click(function() {
    game.util.sound('hit');
});

$('.btn_play').click(function() {
    $('.menu, .overlay').hide();
    $('#difficulty, .overlay').show();
    if ($(this).parents('.menu').attr('id') === 'ingamemenu') {
        game.util.storage('delete', 'optstate');
    }
});

$('#btn_scoreboard').click(function () {
    $('.menu, .overlay').hide();
    $('#scoreboard, .overlay').show();
});

$('.btn_home').click(function () {
    $('.menu, .overlay').hide();
    $('#start, .overlay').show();
    if ($(this).parents('.menu').attr('id') === 'ingamemenu') {
        game.util.storage('delete', 'optstate');
    }
});

$('#btn_ingamemenu').click(function () {
    game.cfg.paused = true;
    $('#ingamemenu, .overlay').show();
});

$('#btn_resume').click(function () {
    $('.menu, .overlay').hide();
    if (!!game.util.storage('read', 'optstate')) {
        game.init();
    } else {
        game.cfg.paused = false;
        setTimeout(game.animate, 20);
    }
});

$('button[id^="btn_difficulty"]').click(function () {
    $('.menu, .overlay').hide();
    game.init($(this).attr('id').split('ty')[1]);
});


