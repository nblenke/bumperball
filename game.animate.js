game.animate = function () {
    var ctx = game.ctx,
        bar = game.cfg.bar;

    ctx.clearRect(0, 0, game.can.width, game.can.height);

    //ctx.save();        
    ctx.lineWidth = game.cfg.ball.r / 6;
    ctx.beginPath();
    ctx.moveTo(bar.x + bar.r, bar.y);
    ctx.lineTo(bar.x + bar.w - bar.r, bar.y);
    ctx.quadraticCurveTo(bar.x + bar.w, bar.y, bar.x + bar.w, bar.y + bar.r);
    ctx.lineTo(bar.x + bar.w, bar.y + bar.h - bar.r);
    ctx.quadraticCurveTo(bar.x + bar.w, bar.y + bar.h, bar.x + bar.w - bar.r, bar.y + bar.h);
    ctx.lineTo(bar.x + bar.r, bar.y + bar.h);
    ctx.quadraticCurveTo(bar.x, bar.y + bar.h, bar.x, bar.y + bar.h - bar.r);
    ctx.lineTo(bar.x, bar.y + bar.r);
    ctx.quadraticCurveTo(bar.x, bar.y, bar.x + bar.r, bar.y);
    ctx.fillStyle = bar.fill.toggle;
    ctx.fill();
    ctx.strokeStyle = bar.stroke.toggle;
    ctx.stroke();
    ctx.closePath();
    //ctx.restore();

    for (var i = 0; i < opt.NUM_BALLS; i++) {
        game.cfg.balls[i].move();
        //ctx.save();
        ctx.beginPath();
        ctx.lineWidth = game.cfg.ball.r / 6;
        ctx.arc(game.cfg.balls[i].x, game.cfg.balls[i].y, game.cfg.ball.r, 0, 2 * Math.PI);
        ctx.fillStyle = game.cfg.balls[i].fillColor;
        ctx.fill();
        ctx.strokeStyle = game.cfg.balls[i].strokeColor;
        ctx.stroke();
        ctx.closePath();
        //ctx.restore();          
    }

    for (var i = 0; i < opt.NUM_TANGOS; i++) {
        game.cfg.tangos[i].move();
        (function () {
            var x = game.cfg.tangos[i].x,
                y = game.cfg.tangos[i].y,
                w = game.cfg.tango.w;

            ctx.beginPath();
            ctx.lineWidth = game.cfg.ball.r / 6;
            ctx.moveTo(x - w / 2, y - w / 2);
            ctx.lineTo(x + w - w / 2, y - w / 2);
            ctx.lineTo(x + w / 2 - w / 2, y  - w / 2 + w);
            ctx.lineTo(x - w / 2, y - w / 2);
            ctx.fillStyle = game.cfg.tangos[i].fillColor;
            ctx.fill();
            ctx.strokeStyle = game.cfg.tangos[i].strokeColor;
            ctx.stroke();
            ctx.closePath();
        }());
    }

    for (var i = 0; i < opt.NUM_BONUS; i++) {
        game.cfg.bonuses[i].move();
        ctx.beginPath();
        ctx.save();
        ctx.translate(game.cfg.bonuses[i].x, game.cfg.bonuses[i].y);
        ctx.rotate(game.cfg.rot * Math.PI / 180);
        ctx.lineWidth = game.cfg.ball.r / 6;
        ctx.fillStyle = game.cfg.bonuses[i].fillColor;
        ctx.fillRect(-game.cfg.bonus.w / 2, -game.cfg.bonus.w / 2, game.cfg.bonus.w, game.cfg.bonus.w);
        //ctx.fill();
        ctx.strokeStyle = game.cfg.bonuses[i].strokeColor;
        //ctx.stroke();
        ctx.strokeRect(-game.cfg.bonus.w / 2, -game.cfg.bonus.w / 2, game.cfg.bonus.w, game.cfg.bonus.w);
        ctx.closePath();
        ctx.restore();
    }

    if (game.cfg.particles.length) {
        //game.cfg.particle.o -= .0025;
        $.each(game.cfg.particles, function (i) {
            this.move();
            ctx.beginPath();
            ctx.lineWidth = game.cfg.ball.r / 6;
            ctx.arc(game.cfg.particles[i].x, game.cfg.particles[i].y, game.cfg.ball.r / 6, 0, 2 * Math.PI);
            ctx.fillStyle = this.fillColor;
            ctx.fill();
            ctx.strokeStyle = this.strokeColor;
            ctx.stroke();
            //ctx.strokeStyle = 'rgba(' + game.cfg.particle.r + ',' + game.cfg.particle.g + ',' + game.cfg.particle.b + ',' + game.cfg.particle.o + ')';
            //ctx.stroke();
            ctx.closePath();
        });
    }

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 50px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Level' + opt.LEVEL, game.cfg.levelUpText.x, game.cfg.levelUpText.y);
    game.cfg.levelUpText.y += opt.YVEL[1];

/*
//ctx.drawImage(game.cfg.balls[i].foo, game.cfg.balls[i].x - game.cfg.ball.r, game.cfg.balls[i].y - game.cfg.ball.r, game.cfg.ball.r, game.cfg.ball.r);
ctx.fillStyle = '#fff';
ctx.font = 'bold 10px sans-serif';
if (game.cfg.balls[i].bonus) {
ctx.fillText('bonus', game.cfg.balls[i].x, game.cfg.balls[i].y);
} 
if (game.cfg.balls[i].tango) {
ctx.fillText('tango', game.cfg.balls[i].x, game.cfg.balls[i].y + 10);
} 
*/

    if (!game.cfg.gameOver && !game.cfg.paused) {
        setTimeout(game.animate, 20);
    }
    game.cfg.rot++;
};

