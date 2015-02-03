function Tango() {
    this.x = Math.random() * game.can.width;
    this.y = Math.floor(Math.random() * 2000) - 2000;

    this.fillColor = 'red';
    this.strokeColor = 'darkred';
    this.xvel = game.util.getRandomArbitary(.7, 1.5);
    this.yvel = game.util.getRandomArbitary(opt.YVEL[0], opt.YVEL[1]);
}

Tango.prototype.move = function(dir) {
    // has hit the bar
    //for (j = 0;j < game.cfg.len; j++) {
        if (this.y > game.cfg.bar.y - game.cfg.ball.r && 
            this.y < game.cfg.bar.y + game.cfg.bar.h / 2 &&
            this.x - (game.cfg.ball.r / 3) < game.cfg.bar.x + game.cfg.bar.w && 
            this.x + (game.cfg.ball.r / 3) > game.cfg.bar.x) {
               

            opt.LIVES -= 1;
            game.cfg.$lives.html(opt.LIVES);
            if (opt.LIVES === 0) {
                game.endGame();
            } else {
                game.hitFlash(this.fillColor);
                game.util.sound('explode');
                // explode
                for (var i = 0; i < game.cfg.particle_count; i++) {
                    game.cfg.particles.push(new Particle(this.x, this.y, this.fillColor, this.fillColor));
                }
            }

            this.x = this.x;
            this.y = -100;

        }
    //}
    // keep in gameboard bounds x
    if (this.x > game.can.width || this.x < 0) {
        this.xvel = -this.xvel;
    }

    // ball hit the bar
    if (this.hasCollided) {
        // hit four times, wobble up y
        //if (this.hits > 3) {
            //this.xvel = Math.random() * 5 - 2.5;
        //}
        
        // bounced back to top leaving gameboard y
        if (this.y < 0) {

            // bounce back down
            if (this.hits < 3) {
	            this.hasCollided = false;

            // else give points
            } else {
	            opt.SCORE += opt.SCORE_INCR;
                opt.SAVED += 1;
	            game.cfg.$score.html(opt.SCORE);
                game.cfg.$saved.html(opt.SAVED);
                game.levelUp();
	            this.y = game.can.height + this.h;
            }

        // hit and moving
        } else {
            this.y -= this.yvel;
            this.x += this.xvel;
        }

    // hasnt collided
    } else {

        // in the gameboard y
        if (this.y + (game.cfg.ball.r / 3) < game.can.height) {
            if (this.hasCollided === false) {
	            this.x += this.xvel;              
            }
            this.y += this.yvel;     

        // fell off game board y
        } else {

            // tango
            if (!this.tangolost) {
                this.tangolost = true;
                opt.TANGO_LOST += 1;
            }
            // move off screen
            this.y = game.can.height + this.h;
        }
    }
}
