function Ball() {
    this.x = Math.random() * game.can.width;
    //this.y = Math.random() * game.can.height;
    //this.y = 0;
    this.y = Math.floor(Math.random() * 2000) - 2000
    this.hits = 0;

    this.xvel = game.util.getRandomArbitary(.7, 1.5);
    this.yvel = game.util.getRandomArbitary(opt.YVEL[0], opt.YVEL[1]);

    //this.foo = new Image()
    //this.foo.src = 'test.png';
}

Ball.prototype.move = function(dir) {

    switch (this.hits) {
    case 1:
        this.fillColor = 'gold';
        this.strokeColor = '#CDAD00';
        break;
    case 2:
        this.fillColor = 'violet';
        this.strokeColor = '#CD69C9';
        break;
    case 3:
        this.fillColor = 'skyblue';
        this.strokeColor = '#6CA6CD';
        break;
    default:
        if (this.hits > 3) {
            this.fillColor = 'skyblue';
            this.strokeColor = '#6CA6CD';
        } else {
            this.fillColor = 'white';
            this.strokeColor = '#ccc';
        }
    }

    // has hit the bar
    //for (j = 0;j < game.cfg.len; j++) {
        if (this.y > game.cfg.bar.y - game.cfg.ball.r && 
            this.y < game.cfg.bar.y + game.cfg.bar.h / 2 &&
            this.x - (game.cfg.ball.r / 3) < game.cfg.bar.x + game.cfg.bar.w && 
            this.x + (game.cfg.ball.r / 3) > game.cfg.bar.x) {
            game.util.sound('hit');
            this.hasCollided = true;
            this.hits += 1;
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

            // normal ball
            if (!this.lost && !this.tango) {
	            this.lost = true;
                opt.SCORE -= opt.SCORE_INCR;
	            opt.LOST_COUNT += 1;
                game.cfg.$score.html(opt.SCORE);
	            game.cfg.$lost.html(opt.LOST_COUNT);
                game.util.sound('lost');
                game.levelUp();
            }

            // move off screen
            //this.y = game.can.height + this.h;

        }
    }
}
