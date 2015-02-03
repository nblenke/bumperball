function Bonus() {
    this.x = Math.random() * game.can.width;
    //this.y = Math.random() * game.can.height;
    //this.y = 0;
    this.y = Math.floor(Math.random() * 2000) - 2000;

    this.hits = 0;
    this.fillColor = 'lime';

    this.strokeColor = '#008B00';
    this.xvel = game.util.getRandomArbitary(.7, 1.5);
    this.yvel = game.util.getRandomArbitary(opt.YVEL[0], opt.YVEL[1]);
}

Bonus.prototype.move = function(dir) {
    // has hit the bar
    if (this.y > game.cfg.bar.y - game.cfg.ball.r && 
        this.y < game.cfg.bar.y + game.cfg.bar.h / 2 &&
        this.x < game.cfg.bar.x + game.cfg.bar.w && 
        this.x > game.cfg.bar.x) {

        if (!game.cfg.gameOver) {
            opt.LIVES += 1;
            game.cfg.$lives.html(opt.LIVES);
            game.hitFlash(this.fillColor);
            game.util.sound('bonus');
            // explode
            for (var i = 0; i < game.cfg.particle_count; i++) {
                game.cfg.particles.push(new Particle(this.x, this.y, this.fillColor, this.fillColor));
            }
        }
        this.y = -100;

        // ball hit the bar
        this.hasCollided = true;
    }

    // ball hit the bar
    if (this.hasCollided) {

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

            if (!this.lost && !this.tango) {
                this.lost = true;
            }
            // move off screen
            this.y = game.can.height * 2;
        }
    }
}
