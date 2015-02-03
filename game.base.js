'use strict';

var opt = {};

var game = {
    can: document.getElementById('canvas'),
    ctx: {},
    cfg: {
        $level: $('.level'),
        $lives: $('.lives'),
        $score: $('.score'),
        $lost: $('.lost'),
        $saved: $('.saved'),

        defaults: [
            // easy
            {
                LEVEL: 1,
                LIVES: 5,
	            SCORE: 0,
                SCORE_INCR: 10,
                SAVED: 0,
	            NUM_BALLS: 20,
                RESTART_COUNT: 20,
                NUM_TANGOS: 0,
                NUM_BONUS: 0,
	            LOST_COUNT: 0,
                TANGO_LOST: 0,
                YVEL: [1.8, 2]
            },
            // normal
            {
                LEVEL: 1,
                LIVES: 3,
	            SCORE: 0,
                SCORE_INCR: 20,
                SAVED: 0,
	            NUM_BALLS: 30,
                RESTART_COUNT: 30,
                NUM_TANGOS: 7,
                NUM_BONUS: 1,
	            LOST_COUNT: 0,
                TANGO_LOST: 0,
                YVEL: [2.5, 2.7]
            },
            // hard
            {
                LEVEL: 1,
                LIVES: 2,
	            SCORE: 0,
                SCORE_INCR: 10,
                SAVED: 0,
	            NUM_BALLS: 35,
                RESTART_COUNT: 35,
                NUM_TANGOS: 12,
                NUM_BONUS: 2,
	            LOST_COUNT: 0,
                TANGO_LOST: 0,
                YVEL: [4.5, 4.7]
            }
        ],
        particle_count: 10,
		leaderboard_size: 5,
        gameOver: false,
        paused: true,
        mouseIsDown: 0,
        dragging: false,
        len: 0,
	    canX: [], 
	    canY: [],
        balls: [],
        tangos: [],
        bonuses: [],
        particles: [],
        levelUpText: {
            x: 0,
            y: 0
        },
        bonus: {
            w: 0
        },
        tango: {
            w: 0
        },
        bar: {
		    x: 0,
		    y: 0,
		    w: 0,
		    h: 0,
		    r: 0,
		    fill: {
			    on: '#fff',
			    off: '#010a25',
			    toggle: ''
		    },
		    stroke: {
			    on: '#ccc',
			    off: '#fff',
			    toggle: ''
		    }
	    },
        ball: {
            r: 0
        },
        rot: 0
    },

    load: function () {
        var setDimensions = function () {
                var w = $('#wrap').width(),
                    h = $('#wrap').height();

                $('.menu, .overlay').css({
                    'width': w + 'px',
                    'height': (h + $('.dash-top').height()) +'px'
                });
                game.can.width = w;
                game.can.height = h;
                
                game.cfg.bar.x = game.can.width / 2;
                game.cfg.bar.y = game.can.height / 1.30;
                game.cfg.bar.w = game.can.width / 2.8;
                game.cfg.bar.h = game.can.height / 5;
                game.cfg.bar.r = game.cfg.bar.h / 3;

                game.cfg.ball.r = game.can.width / 16;
                game.cfg.tango.w = game.can.width / 16 * 2;

                game.cfg.bonus.w = game.can.width / 18 * 2;
            };

        game.ctx = game.can.getContext('2d');
        setDimensions();
        $('#start').show();

        $(window).resize( function () {
            setDimensions();
        });
        game.scoreboard();
        if(!!game.util.storage('read', 'optstate')) {
            game.cfg.paused = true;
            $('#start').hide();
            $('#ingamemenu').show();
        }
    },

    setDefaults: function (dif) {
        var optstate = game.util.storage('read', 'optstate');
        if(!!optstate) {
            opt = optstate;
        } else {
            opt = $.extend({}, game.cfg.defaults[dif]);
        }

        game.cfg.$level.html(opt.LEVEL);
        game.cfg.$lives.html(opt.LIVES);
        game.cfg.$score.html(opt.SCORE);
        game.cfg.$lost.html(opt.LOST_COUNT);
        game.cfg.$saved.html(opt.SAVED);
    },

    buildBalls: function () {
        game.cfg.balls = [];
        game.cfg.tangos = [];
        game.cfg.bonuses = [];

        for (var i = 0; i < opt.NUM_BALLS; i++) {
            game.cfg.balls[i] = new Ball();
        }
        for (var i = 0; i < opt.NUM_TANGOS; i++) {
            game.cfg.tangos[i] = new Tango();
        }
        for (var i = 0; i < opt.NUM_BONUS; i++) {
            game.cfg.bonuses[i] = new Bonus();
        }

        game.cfg.levelUpText.x = game.can.width / 2;
        game.cfg.levelUpText.y = 50;

        game.cfg.particles = [];
        //console.log(game.cfg.bonuses)
    },

    levelUp: function () {
        if (opt.LOST_COUNT + opt.SAVED === opt.RESTART_COUNT) {
            opt.NUM_BALLS += 2;
            opt.SCORE_INCR += 5;
            opt.YVEL[0] += 0.1;
            opt.YVEL[1] += 0.1;
            opt.NUM_TANGOS += 1;
            //opt.NUM_BONUS += 1;
            opt.LEVEL += 1;
            opt.RESTART_COUNT += opt.NUM_BALLS;

            game.hitFlash('#112E84');
            game.cfg.$level.html(opt.LEVEL);   
            game.buildBalls();
            game.util.storage('write', 'optstate', opt);
            game.util.sound('levelup');
        }
    },

    hitFlash: function (color) {
/* breaks on android
        var repeat = 0,
            el = $('#canvas'),
            intf = 120,
            intv = setInterval(function () {
                el.animate({
                    background: color
                }, intf);

                setTimeout(function () {
                    el.animate({
                        background: 'transparent'
                    }, intf)
                }, intf);

                repeat += 1;
                if (repeat === 3) {
                    clearInterval(intv);
                }
            }, intf * 1);
*/
    },

    endGame: function () {
        var rootRef = new Firebase('https://nblenke.firebaseio.com/bumperball/scoreboard'),
			scoreListRef = rootRef.child("scoreList"),
			scoreListView = scoreListRef.limit(game.cfg.leaderboard_size);

        game.cfg.gameOver = true;
        game.util.storage('delete', 'optstate');
        game.util.sound('gameover');

		scoreListView.on('value', function (snapshot) {
			var aRank = [];
            Array.max = function(array){
                return Math.max.apply(Math, array);
            };
            Array.min = function(array){
                return Math.min.apply(Math, array);
            };

			snapshot.forEach(function(childSnapshot) {
				var childData = childSnapshot.val();
				aRank.push(childSnapshot.val().score);
			});
			console.log(aRank, Number(opt.SCORE), Array.min(aRank))
			if (Number(opt.SCORE) > Array.min(aRank)) {
				$('#post_score_form').show();
                $('#post_score_form input').val('');
                $('#nameInput0').focus();
				$('#gameover .btn_play, #gameover .btn_home').hide();
			} else {
                $('#post_score_form').hide();
				$('#gameover .btn_play, #gameover .btn_home').show();
            }
		});
		$('#gameover, .overlay').show();
    },

    init: function (dif) {
        game.cfg.gameOver = false;
        game.cfg.paused = false;
        game.setDefaults(dif);
        game.buildBalls();
        game.animate();
    }
}
